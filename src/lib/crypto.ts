import crypto from "crypto"

const algorithm = "aes-256-gcm"

/**
 * Encrypts text using AES-256-GCM.
 * @param text The plain text to encrypt.
 * @param key The encryption key (32-byte Buffer).
 */
export function encrypt(text: string, key: Buffer) {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(algorithm, key, iv)

  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")

  const tag = cipher.getAuthTag()

  return {
    encryptedData: encrypted,
    iv: iv.toString("hex"),
    tag: tag.toString("hex"),
  }
}

/**
 * Decrypts text using AES-256-GCM.
 * @param encryptedText The encrypted hex string.
 * @param ivHex The initialization vector in hex.
 * @param tagHex The auth tag in hex.
 * @param key The encryption key (32-byte Buffer).
 */
export function decrypt(
  encryptedText: string,
  ivHex: string,
  tagHex: string,
  key: Buffer
) {
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(ivHex, "hex")
  )

  decipher.setAuthTag(Buffer.from(tagHex, "hex"))

  let decrypted = decipher.update(encryptedText, "hex", "utf8")
  decrypted += decipher.final("utf8")

  return decrypted
}

/**
 * Generates a random 32-byte key for encryption.
 */
export function generateEncryptionKey() {
  return crypto.randomBytes(32)
}

/**
 * Derives a 32-byte key from a string (e.g., master key) using PBKDF2.
 * This is useful for turning a user-provided master key into a cryptographically strong AES key.
 */
export function deriveKey(secret: string, salt: string) {
  return crypto.pbkdf2Sync(secret, salt, 100000, 32, "sha256")
}
