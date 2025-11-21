import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'

// Diagnostic endpoint to check gallery system configuration
export async function GET() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    checks: {}
  }

  try {
    // Check environment variables
    diagnostics.checks.supabaseUrl = {
      status: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      value: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing'
    }

    diagnostics.checks.supabaseServiceKey = {
      status: !!process.env.SUPABASE_SERVICE_KEY,
      value: process.env.SUPABASE_SERVICE_KEY ? 'Set' : 'Missing'
    }

    diagnostics.checks.databaseUrl = {
      status: !!process.env.DATABASE_URL,
      value: process.env.DATABASE_URL ? 'Set' : 'Missing'
    }

    // Test Supabase connection
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_KEY
        )

        // Test storage bucket access
        const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
        
        diagnostics.checks.supabaseStorage = {
          status: !bucketError,
          buckets: buckets?.map(b => b.name) || [],
          uploadsExists: buckets?.some(b => b.name === 'uploads') || false,
          error: bucketError?.message
        }

      } catch (supabaseError) {
        diagnostics.checks.supabaseStorage = {
          status: false,
          error: supabaseError.message
        }
      }
    }

    // Test database connection
    if (process.env.DATABASE_URL) {
      try {
        const prisma = new PrismaClient()
        await prisma.$connect()
        
        // Check if gallery table exists
        const tableExists = await prisma.galleryImage.findMany({ take: 1 })
        
        diagnostics.checks.database = {
          status: true,
          galleryTableExists: true,
          connection: 'Success'
        }

        await prisma.$disconnect()

      } catch (dbError) {
        diagnostics.checks.database = {
          status: false,
          error: dbError.message,
          galleryTableExists: false
        }
      }
    }

  } catch (error) {
    diagnostics.error = error.message
  }

  return NextResponse.json(diagnostics)
}