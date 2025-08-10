import { clerkClient } from '@clerk/nextjs/server'

// Email whitelist - only these emails can sign in
export const WHITELISTED_EMAILS = [
  'pratyayrakesh@gmail.com',
]

export async function isEmailWhitelisted(email: string): Promise<boolean> {
  return WHITELISTED_EMAILS.includes(email.toLowerCase())
}

export async function createWhitelistedUser(email: string) {
  try {
    const client = await clerkClient()
    
    // Check if user already exists
    const existingUsers = await client.users.getUserList({
      emailAddress: [email],
    })

    if (existingUsers.length > 0) {
      return existingUsers[0]
    }

    // Create new user if they don't exist
    const user = await client.users.createUser({
      emailAddress: [email],
      password: undefined, // No password for magic link auth
    })

    return user
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
} 