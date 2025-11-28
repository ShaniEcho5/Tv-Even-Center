import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'
import { createAdmin, getAllAdmins, deleteAdmin } from '@/lib/supabase'

// Helper function to hash password
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex')
}

// Helper function to check if user is authenticated
async function isAuthenticated() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('admin-session')
    return !!sessionToken
  } catch (error) {
    return false
  }
}

// GET - Get all admins (only authenticated admins)
export async function GET(request) {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ 
        error: 'Unauthorized' 
      }, { status: 401 })
    }

    const result = await getAllAdmins()
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        admins: result.data 
      })
    } else {
      throw new Error(result.error)
    }
  } catch (error) {
    console.error('Error fetching admins:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to fetch admins' 
    }, { status: 500 })
  }
}

// POST - Create a new admin (only authenticated admins)
export async function POST(request) {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ 
        error: 'Unauthorized' 
      }, { status: 401 })
    }

    const { username, email, password, confirmPassword } = await request.json()

    // Validation
    if (!username || !email || !password) {
      return NextResponse.json({ 
        error: 'Username, email, and password are required' 
      }, { status: 400 })
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ 
        error: 'Passwords do not match' 
      }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ 
        error: 'Password must be at least 6 characters long' 
      }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        error: 'Invalid email format' 
      }, { status: 400 })
    }

    // Hash password
    const hashedPassword = hashPassword(password)

    // Create admin in Supabase
    const result = await createAdmin(username, email, hashedPassword)

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Admin created successfully',
        admin: result.data[0]
      }, { status: 201 })
    } else {
      // Check if it's a duplicate username/email error
      if (result.error && result.error.includes('duplicate')) {
        return NextResponse.json({ 
          error: 'Username or email already exists' 
        }, { status: 409 })
      }
      throw new Error(result.error)
    }
  } catch (error) {
    console.error('Error creating admin:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to create admin' 
    }, { status: 500 })
  }
}

// DELETE - Delete an admin (only authenticated admins)
export async function DELETE(request) {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ 
        error: 'Unauthorized' 
      }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const adminId = searchParams.get('id')

    if (!adminId) {
      return NextResponse.json({ 
        error: 'Admin ID is required' 
      }, { status: 400 })
    }

    const result = await deleteAdmin(adminId)

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Admin deleted successfully' 
      })
    } else {
      throw new Error(result.error)
    }
  } catch (error) {
    console.error('Error deleting admin:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to delete admin' 
    }, { status: 500 })
  }
}
