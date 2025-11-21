import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// GET - Fetch single gallery image
export async function GET(request, { params }) {
  try {
    const { id } = params

    const { data: image, error: fetchError } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !image) {
      return NextResponse.json(
        { error: 'Gallery image not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(image)

  } catch (error) {
    console.error('Error fetching gallery image:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gallery image' },
      { status: 500 }
    )
  }
}

// PATCH - Update gallery image
export async function PATCH(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    
    const {
      title,
      alt,
      description,
      category,
      venue,
      status,
      featured
    } = body

    // Validate required fields
    if (title !== undefined && !title.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    if (alt !== undefined && !alt.trim()) {
      return NextResponse.json(
        { error: 'Alt text is required' },
        { status: 400 }
      )
    }

    // Check if image exists
    const { data: existingImage, error: fetchError } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !existingImage) {
      return NextResponse.json(
        { error: 'Gallery image not found' },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData = {}
    if (title !== undefined) updateData.title = title.trim()
    if (alt !== undefined) updateData.alt = alt.trim()
    if (description !== undefined) updateData.description = description.trim()
    if (category !== undefined) updateData.category = category
    if (venue !== undefined) updateData.venue = venue.trim()
    if (status !== undefined) updateData.status = status
    if (featured !== undefined) updateData.featured = featured
    updateData.updatedAt = new Date().toISOString()

    // Update the image
    const { data: updatedImage, error: updateError } = await supabase
      .from('gallery_images')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update gallery image', details: updateError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      image: updatedImage
    })

  } catch (error) {
    console.error('Error updating gallery image:', error)
    return NextResponse.json(
      { error: 'Failed to update gallery image' },
      { status: 500 }
    )
  }
}

// DELETE - Delete single gallery image
export async function DELETE(request, { params }) {
  try {
    const { id } = params

    // Get image to delete (to clean up storage)
    const { data: image, error: fetchError } = await supabase
      .from('gallery_images')
      .select('fileName')
      .eq('id', id)
      .single()

    if (fetchError || !image) {
      return NextResponse.json(
        { error: 'Gallery image not found' },
        { status: 404 }
      )
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('gallery_images')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Delete error:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete gallery image', details: deleteError.message },
        { status: 500 }
      )
    }

    // Delete from storage
    try {
      await supabase.storage
        .from('gallery-images')
        .remove([image.fileName])
    } catch (storageError) {
      console.warn('Failed to delete from storage:', image.fileName, storageError)
    }

    return NextResponse.json({
      success: true,
      message: 'Gallery image deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting gallery image:', error)
    return NextResponse.json(
      { error: 'Failed to delete gallery image' },
      { status: 500 }
    )
  }
}