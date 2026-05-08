import bcrypt from "bcryptjs"

/**
 * Hashes a password or master key using bcrypt.
 */
export async function hashValue(value: string) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(value, salt)
}

/**
 * Compares a plain text value with a bcrypt hash.
 */
export async function compareValue(value: string, hash: string) {
  return bcrypt.compare(value, hash)
}
