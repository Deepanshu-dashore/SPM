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

export async function addSecret(projectId: string, masterKey: string, key: string, value: string) {
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
    createdAt: s.createdAt,
  }))
}
