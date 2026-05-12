"use server"

import clientPromise from "@/lib/mongodb"
import { auth } from "@/lib/auth"
import { encrypt, decrypt, deriveKey } from "@/lib/crypto"
import { ObjectId } from "mongodb"
import { revalidatePath } from "next/cache"

const MASTER_KEY_SALT = process.env.MASTER_KEY_SALT || "default-salt-change-me"

/**
 * Retrieves the user's decrypted Vault Key using their Master Key.
 * This is a sensitive internal function.
 */
async function getVaultKey(userId: string, masterKey: string) {
  const client = await clientPromise
  const db = client.db()
  const user = await db.collection("users").findOne({ _id: new ObjectId(userId) })

  if (!user || !user.encryptedVaultKey) {
    throw new Error("Vault not found")
  }

  const { data, iv, tag } = user.encryptedVaultKey
  const derivedMasterKey = deriveKey(masterKey, MASTER_KEY_SALT)
  
  const decryptedVaultKeyHex = decrypt(data, iv, tag, derivedMasterKey)
  return Buffer.from(decryptedVaultKeyHex, "hex")
}

export async function createProject(name: string, description?: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const client = await clientPromise
  const db = client.db()

  const result = await db.collection("projects").insertOne({
    name,
    description,
    userId: new ObjectId(session.user.id),
    createdAt: new Date(),
  })

  revalidatePath("/dashboard")
  return result.insertedId.toString()
}

export async function addSecret(projectId: string, masterKey: string, key: string, value: string, environment: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const client = await clientPromise
  const db = client.db()

  // 1. Get the user's Vault Key (using Master Key)
  const vaultKey = await getVaultKey(session.user.id, masterKey)

  // 2. Encrypt the secret value using the Vault Key
  const { encryptedData, iv, tag } = encrypt(value, vaultKey)

  // 3. Store the secret
  await db.collection("secrets").insertOne({
    projectId: new ObjectId(projectId),
    key,
    encryptedValue: encryptedData,
    iv,
    tag,
    environment,
    createdAt: new Date(),
  })

  revalidatePath(`/dashboard/projects/${projectId}`)
}

export async function getSecrets(projectId: string, masterKey: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const client = await clientPromise
  const db = client.db()

  // 1. Get secrets for the project
  const secrets = await db.collection("secrets").find({ 
    projectId: new ObjectId(projectId) 
  }).toArray()

  // 2. Get user's Vault Key
  const vaultKey = await getVaultKey(session.user.id, masterKey)

  // 3. Decrypt each secret
  return secrets.map(s => ({
    id: s._id.toString(),
    key: s.key,
    value: decrypt(s.encryptedValue, s.iv, s.tag, vaultKey),
    environment: s.environment || "production",
    createdAt: s.createdAt,
  }))
}

export async function updateSecret(secretId: string, masterKey: string, key: string, value: string, environment: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const client = await clientPromise
  const db = client.db()

  // 1. Get the user's Vault Key
  const vaultKey = await getVaultKey(session.user.id, masterKey)

  // 2. Encrypt the new secret value
  const { encryptedData, iv, tag } = encrypt(value, vaultKey)

  // 3. Update the secret
  const result = await db.collection("secrets").updateOne(
    { _id: new ObjectId(secretId) },
    { 
      $set: { 
        key, 
        encryptedValue: encryptedData, 
        iv, 
        tag, 
        environment,
        updatedAt: new Date()
      } 
    }
  )

  const secret = await db.collection("secrets").findOne({ _id: new ObjectId(secretId) })
  if (secret) {
    revalidatePath(`/dashboard/projects/${secret.projectId}`)
  }
}

export async function deleteSecret(secretId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const client = await clientPromise
  const db = client.db()

  const secret = await db.collection("secrets").findOne({ _id: new ObjectId(secretId) })
  if (!secret) throw new Error("Secret not found")

  await db.collection("secrets").deleteOne({ _id: new ObjectId(secretId) })

  revalidatePath(`/dashboard/projects/${secret.projectId}`)
}

export async function importSecrets(projectId: string, masterKey: string, envContent: string, environment: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const client = await clientPromise
  const db = client.db()

  // 1. Get the user's Vault Key
  const vaultKey = await getVaultKey(session.user.id, masterKey)

  // 2. Parse the .env content
  const lines = envContent.split("\n")
  const secretsToInsert = []

  for (const line of lines) {
    const trimmedLine = line.trim()
    if (!trimmedLine || trimmedLine.startsWith("#")) continue

    const [key, ...valueParts] = trimmedLine.split("=")
    if (key && valueParts.length > 0) {
      const rawValue = valueParts.join("=").replace(/^['"]|['"]$/g, "") // Remove quotes
      
      // Encrypt the value
      const { encryptedData, iv, tag } = encrypt(rawValue, vaultKey)
      
      secretsToInsert.push({
        projectId: new ObjectId(projectId),
        key: key.trim(),
        encryptedValue: encryptedData,
        iv,
        tag,
        environment,
        createdAt: new Date(),
      })
    }
  }

  if (secretsToInsert.length > 0) {
    await db.collection("secrets").insertMany(secretsToInsert)
  }

  revalidatePath(`/dashboard/projects/${projectId}`)
}
