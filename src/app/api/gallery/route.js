import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// GET - Fetch gallery images for public gallery page
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build query for Supabase
    let query = supabase
      .from('gallery_images')
      .select('id, title, alt, imageUrl, category, venue, featured, createdAt')
      .eq('status', 'active')
      .order('featured', { ascending: false })
      .order('createdAt', { ascending: false })
      .range(offset, offset + limit - 1)

    // Add category filter if specified
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    const { data: images, error, count } = await query

    if (error) {
      console.error('Supabase query error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch gallery images' },
        { status: 500 }
      )
    }

    // Transform to match the existing gallery data structure
    const transformedImages = (images || []).map(image => ({
      id: image.id,
      src: image.imageUrl,
      alt: image.alt,
      category: image.category,
      title: image.title,
      venue: image.venue || '',
      featured: image.featured
    }))

    // Get total count for pagination
    const { count: totalCount } = await supabase
      .from('gallery_images')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    return NextResponse.json({
      images: transformedImages,
      pagination: {
        total: totalCount || 0,
        limit,
        offset,
        hasMore: (offset + limit) < (totalCount || 0)
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