import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Fetch gallery images for public gallery page
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where = {
      status: 'active' // Only show active images to public
    }

    if (category && category !== 'all') {
      where.category = category
    }

    const images = await prisma.galleryImage.findMany({
      where,
      select: {
        id: true,
        title: true,
        alt: true,
        imageUrl: true,
        category: true,
        venue: true,
        featured: true,
        createdAt: true
      },
      orderBy: [
        { featured: 'desc' }, // Featured images first
        { createdAt: 'desc' }
      ],
      take: limit,
      skip: offset
    })

    // Transform to match the existing gallery data structure
    const transformedImages = images.map(image => ({
      id: image.id,
      src: image.imageUrl,
      alt: image.alt,
      category: image.category,
      title: image.title,
      venue: image.venue || '',
      featured: image.featured
    }))

    const total = await prisma.galleryImage.count({ where })

    return NextResponse.json({
      images: transformedImages,
      pagination: {
        total,
        limit,
        offset,
        hasMore: (offset + limit) < total
      }
    })

  } catch (error) {
    console.error('Error fetching public gallery images:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gallery images' },
      { status: 500 }
    )
  }
}