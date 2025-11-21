import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// GET - Fetch gallery images
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status') || 'active'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Use Supabase client directly like blog API
    let query = supabase
      .from('gallery_images')
      .select('*')
      .eq('status', status)
      .order('createdAt', { ascending: false })
      .range(offset, offset + limit - 1)

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    const { data: images, error: fetchError, count } = await query

    if (fetchError) {
      console.error('Supabase fetch error:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch gallery images', details: fetchError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      images: images || [],
      pagination: {
        total: count || images?.length || 0,
        limit,
        offset,
        hasMore: (offset + limit) < (count || 0)
      }
    })

  } catch (error) {
    console.error('Error fetching gallery images:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gallery images' },
      { status: 500 }
    )
  }
}

// POST - Upload new gallery image
export async function POST(request) {
  try {
    // Check environment variables first
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      console.error('Missing Supabase environment variables')
      return NextResponse.json(
        { 
          error: 'Server configuration error',
          details: 'Missing SUPABASE_SERVICE_KEY or SUPABASE_URL'
        },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file')
    const title = formData.get('title')
    const alt = formData.get('alt')
    const description = formData.get('description') || ''
    const category = formData.get('category') || 'general'
    const venue = formData.get('venue') || ''

    console.log('Gallery upload attempt:', { 
      hasFile: !!file, 
      title, 
      alt, 
      category,
      fileSize: file?.size,
      fileType: file?.type
    })

    if (!file || !title || !alt) {
      return NextResponse.json(
        { error: 'File, title, and alt text are required' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, and WebP images are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (2MB limit for gallery)
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 2MB for gallery images.' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create unique filename
    const timestamp = Date.now()
    const originalName = file.name
    const extension = originalName.split('.').pop().toLowerCase()
    const filename = `gallery-${timestamp}.${extension}`

    // Check if gallery-images bucket exists, create if not
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    const galleryBucket = buckets?.find(bucket => bucket.name === 'gallery-images')

    if (!galleryBucket) {
      console.log('Creating gallery-images bucket...')
      const { error: bucketError } = await supabase.storage.createBucket('gallery-images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        fileSizeLimit: 2097152 // 2MB limit for gallery images
      })

      if (bucketError) {
        console.error('Failed to create gallery bucket:', bucketError)
        return NextResponse.json({ 
          error: 'Storage bucket creation failed', 
          details: bucketError.message 
        }, { status: 500 })
      }
    }

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('gallery-images')
      .upload(filename, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Supabase upload error:', uploadError)
      return NextResponse.json(
        { 
          error: 'Failed to upload image',
          details: uploadError.message,
          code: uploadError.error || 'STORAGE_ERROR'
        },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('gallery-images')
      .getPublicUrl(filename)

    if (!publicUrlData?.publicUrl) {
      return NextResponse.json(
        { error: 'Failed to get image URL' },
        { status: 500 }
      )
    }

    // Save to database using Supabase client directly
    const { data: galleryImage, error: insertError } = await supabase
      .from('gallery_images')
      .insert({
        title,
        alt,
        description,
        imageUrl: publicUrlData.publicUrl,
        category,
        venue,
        fileSize: file.size,
        fileName: filename,
        mimeType: file.type,
        status: 'active'
      })
      .select()
      .single()

    if (insertError) {
      console.error('Database insert error:', insertError)
      return NextResponse.json(
        { 
          error: 'Failed to save gallery image to database',
          details: insertError.message
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      image: galleryImage
    })

  } catch (error) {
    console.error('Error creating gallery image:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create gallery image',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

// DELETE - Delete multiple images
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const ids = searchParams.get('ids')?.split(',') || []

    if (ids.length === 0) {
      return NextResponse.json(
        { error: 'No image IDs provided' },
        { status: 400 }
      )
    }

    // Get images to delete (to clean up storage)
    const { data: images, error: fetchError } = await supabase
      .from('gallery_images')
      .select('fileName')
      .in('id', ids)

    if (fetchError) {
      console.error('Error fetching images for deletion:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch images for deletion' },
        { status: 500 }
      )
    }

    // Delete from database
    const { error: deleteError, count } = await supabase
      .from('gallery_images')
      .delete()
      .in('id', ids)

    if (deleteError) {
      console.error('Error deleting from database:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete images from database' },
        { status: 500 }
      )
    }

    // Delete from storage
    for (const image of images) {
      try {
        await supabase.storage
          .from('gallery-images')
          .remove([image.fileName])
      } catch (storageError) {
        console.warn('Failed to delete from storage:', image.fileName, storageError)
      }
    }

    return NextResponse.json({
      success: true,
      deletedCount: count || 0
    })

  } catch (error) {
    console.error('Error deleting gallery images:', error)
    return NextResponse.json(
      { error: 'Failed to delete gallery images' },
      { status: 500 }
    )
  }
}