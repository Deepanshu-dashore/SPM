"use server"

import clientPromise from "@/lib/mongodb"
import { hashValue, compareValue } from "@/lib/auth-utils"
import { generateEncryptionKey, encrypt, deriveKey } from "@/lib/crypto"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { ObjectId } from "mongodb"

const MASTER_KEY_SALT = process.env.MASTER_KEY_SALT || "default-salt-change-me"

export async function signup(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const masterKey = formData.get("masterKey") as string

  if (!email || !password || !masterKey) {
    throw new Error("Missing required fields")
  }

  const client = await clientPromise
  const db = client.db()

  // Check if user exists
  const existingUser = await db.collection("users").findOne({ email })
  if (existingUser) {
    throw new Error("User already exists")
  }

  // 1. Hash password and master key
  const passwordHash = await hashValue(password)
  const masterKeyHash = await hashValue(masterKey)

  // 2. Generate a random 32-byte Vault Key for this user
  const vaultKey = generateEncryptionKey()

  // 3. Derive an AES key from the user's Master Key to encrypt the Vault Key
  // We use the Master Key + Salt to create a strong key for AES
  const derivedMasterKey = deriveKey(masterKey, MASTER_KEY_SALT)

  // 4. Encrypt the Vault Key using the Derived Master Key
  const { encryptedData, iv, tag } = encrypt(vaultKey.toString("hex"), derivedMasterKey)

  // 5. Store user with everything
  // We store the encrypted Vault Key (plus IV/Tag) so it can be unlocked later with the Master Key
  await db.collection("users").insertOne({
    name,
    email,
    passwordHash,
    masterKeyHash,
    encryptedVaultKey: {
      data: encryptedData,
      iv,
      tag,
    },
    createdAt: new Date(),
  })

  redirect("/login")
}

export async function updateUserSettings(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const name = formData.get("name") as string
  const email = formData.get("email") as string
  
  const client = await clientPromise
  const db = client.db()

  await db.collection("users").updateOne(
    { _id: new ObjectId(session.user.id) },
    { $set: { name, email } }
  )

  return { success: true, message: "Profile updated successfully" }
}

export async function updateUserPassword(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const currentPassword = formData.get("currentPassword") as string
  const newPassword = formData.get("newPassword") as string

  if (!currentPassword || !newPassword) {
    throw new Error("Missing required fields")
  }

  const client = await clientPromise
  const db = client.db()

  const user = await db.collection("users").findOne({ _id: new ObjectId(session.user.id) })
  if (!user) {
    throw new Error("User not found")
  }

  const isPasswordValid = await compareValue(currentPassword, user.passwordHash)
  if (!isPasswordValid) {
    throw new Error("Incorrect current password")
  }

  const newPasswordHash = await hashValue(newPassword)
  await db.collection("users").updateOne(
    { _id: new ObjectId(session.user.id) },
    { $set: { passwordHash: newPasswordHash } }
  )

  return { success: true, message: "Password updated successfully" }
}
