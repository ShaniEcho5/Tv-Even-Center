import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'

const prisma = new PrismaClient()

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// GET - Fetch single gallery image
export async function GET(request, { params }) {
  try {
    const { id } = params

    const image = await prisma.galleryImage.findUnique({
      where: { id }
    })

    if (!image) {
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
    const existingImage = await prisma.galleryImage.findUnique({
      where: { id }
    })

    if (!existingImage) {
      return NextResponse.json(
        { error: 'Gallery image not found' },
        { status: 404 }
      )
    }

    // Update the image
    const updatedImage = await prisma.galleryImage.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(alt !== undefined && { alt: alt.trim() }),
        ...(description !== undefined && { description: description.trim() }),
        ...(category !== undefined && { category }),
        ...(venue !== undefined && { venue: venue.trim() }),
        ...(status !== undefined && { status }),
        ...(featured !== undefined && { featured })
      }
    })

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
    const image = await prisma.galleryImage.findUnique({
      where: { id },
      select: { fileName: true }
    })

    if (!image) {
      return NextResponse.json(
        { error: 'Gallery image not found' },
        { status: 404 }
      )
    }

    // Delete from database
    await prisma.galleryImage.delete({
      where: { id }
    })

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