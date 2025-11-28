import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'
import { validateAdminCredentials } from '@/lib/supabase'

// Super admin credentials from environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'TVSEvent2024!'

// Helper function to hash password using SHA256
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export async function POST(request) {
  try {
    const { username, password } = await request.json()

    let isValidAdmin = false
    let adminInfo = null

    // First check if it's the super admin from environment variables
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      isValidAdmin = true
      adminInfo = { username, isSuperAdmin: true }
    } else {
      // Check against Supabase admins table
      const hashedPassword = hashPassword(password)
      const result = await validateAdminCredentials(username, hashedPassword)
      
      if (result.success && result.admin) {
        isValidAdmin = true
        adminInfo = { username: result.admin.username, isSuperAdmin: false, adminId: result.admin.id }
      }
    }

    if (isValidAdmin) {
      // Create a simple session token
      const sessionToken = Buffer.from(`${username}:${Date.now()}`).toString('base64')
      
      // Set secure cookie
      const cookieStore = await cookies()
      cookieStore.set('admin-session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/'
      })

      return NextResponse.json({ 
        success: true, 
        message: 'Login successful',
        adminInfo
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid credentials' 
      }, { status: 401 })
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Login failed' 
    }, { status: 500 })
  }
}

// GET - Check if user is authenticated
export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('admin-session')

    if (sessionToken) {
      return NextResponse.json({ authenticated: true })
    } else {
      return NextResponse.json({ authenticated: false })
    }
  } catch (error) {
    return NextResponse.json({ authenticated: false })
  }
}