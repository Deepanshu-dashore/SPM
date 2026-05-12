import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"
import { compareValue } from "@/lib/auth-utils"
import { authConfig } from "@/lib/auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    Credentials({
      name: "Vault Access",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        masterKey: { label: "Master Vault Key", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.masterKey) {
          return null
        }

        const client = await clientPromise
        const db = client.db()
        const user = await db.collection("users").findOne({ email: credentials.email })

        if (!user || !user.passwordHash || !user.masterKeyHash) {
          return null
        }

        const isPasswordValid = await compareValue(
          credentials.password as string,
          user.passwordHash
        )

        if (!isPasswordValid) return null

        const isMasterKeyValid = await compareValue(
          credentials.masterKey as string,
          user.masterKeyHash
        )

        if (!isMasterKeyValid) return null

        // If both are valid, return the user object
        // Note: We don't store the Master Key in the session for security.
        // The user will have to re-enter it or we use a short-lived session token.
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        }
      },
    }),
  ],
})
