'use client'

import { useState, useMemo, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BlogHero from '@/components/BlogHero'
import BlogCard from '@/components/BlogCard'
import SectionHeading from '@/components/SectionHeading'
import SEOHead from '@/components/SEOHead'
import { motion } from 'framer-motion'
import { Search, Filter, Grid, List } from 'lucide-react'
export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  // Categories for filtering
  const blogCategories = [
    { id: 'all', name: 'All Posts', slug: 'all' },
    { id: 'wedding', name: 'Wedding Planning', slug: 'Wedding Planning' },
    { id: 'corporate', name: 'Corporate Events', slug: 'Corporate Events' },
    { id: 'party', name: 'Party Planning', slug: 'Party Planning' },
    { id: 'catering', name: 'Catering', slug: 'Catering' },
    { id: 'photography', name: 'Photography', slug: 'Photography' },
    { id: 'design', name: 'Event Design', slug: 'Event Design' },
    { id: 'entertainment', name: 'Entertainment', slug: 'Entertainment' }
  ]

  // Fetch posts from API
  const fetchPosts = async () => {
    try {
      setLoading(true)
      let url = '/api/blog?limit=50'
      
      if (selectedCategory !== 'all') {
        const categorySlug = blogCategories.find(c => c.id === selectedCategory)?.slug
        if (categorySlug) {
          url += `&category=${encodeURIComponent(categorySlug)}`
        }
      }
      
      if (searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery)}`
      }

      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [selectedCategory, searchQuery])

  const featuredPosts = posts.filter(post => post.featured)
  const filteredPosts = posts

  return (
    <>
      <SEOHead 
        title="Event Planning Blog"
        description="Expert event planning tips, wedding advice, and celebration ideas from TVS Event Center. Learn from our experienced team about creating memorable events."
        canonical="/blog"
        keywords="event planning blog, wedding tips, corporate event advice, party planning, event ideas, celebration planning"
      />
      <Navbar />
      <main>
        {/* Hero Section */}
        <BlogHero />

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="section-padding bg-white">
            <div className="max-w-7xl mx-auto container-padding">
              <SectionHeading
                subtitle="Featured Articles"
                title="Editor's Picks"
                description="Our most popular and insightful posts to help you plan amazing events"
                centered={true}
                className="mb-12"
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredPosts.slice(0, 2).map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                  >
                    <BlogCard post={post} featured={true} />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Search and Filter Section */}
        <section className="py-8 bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md flex">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchPosts()}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-l-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                  />
                </div>
                <button
                  onClick={fetchPosts}
                  className="px-4 py-3 bg-amber-600 text-white rounded-r-lg hover:bg-amber-700 transition-colors"
                >
                  Search
                </button>
              </div>

              {/* Filter Toggle */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span>Categories</span>
                </button>

                {/* View Mode Toggle */}
                <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition-colors ${
                      viewMode === 'grid' ? 'bg-amber-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 transition-colors ${
                      viewMode === 'list' ? 'bg-amber-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Category Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-gray-200"
              >
                <div className="flex flex-wrap gap-2">
                  {blogCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedCategory === category.id
                          ? 'bg-primary text-white shadow-lg'
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-300 hover:text-amber-700'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* All Posts */}
        <section className="section-padding bg-white">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {searchQuery 
                    ? `Search Results for "${searchQuery}"` 
                    : selectedCategory === 'all' 
                      ? 'All Articles' 
                      : blogCategories.find(c => c.id === selectedCategory)?.name || 'Articles'
                  }
                </h2>
                <p className="text-gray-600 mt-2">{filteredPosts.length} articles found</p>
              </div>
            </div>

            {filteredPosts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery 
                    ? `No articles match "${searchQuery}". Try different keywords or browse all categories.`
                    : 'No articles in this category yet. Check back soon for new content!'
                  }
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                  }}
                  className="btn-primary"
                >
                  View All Articles
                </button>
              </motion.div>
            ) : (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                  : 'space-y-6'
              }>
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={viewMode === 'list' ? 'max-w-4xl' : ''}
                  >
                    <BlogCard 
                      post={post} 
                      className={viewMode === 'list' ? 'flex flex-row' : ''}
                    />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Load More (for future pagination) */}
            {filteredPosts.length > 9 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mt-12"
              >
                <button className="btn-secondary">
                  Load More Articles
                </button>
              </motion.div>
            )}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="section-padding bg-gradient-to-r from-amber-600 to-orange-600">
          <div className="max-w-4xl mx-auto container-padding text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Stay Updated with Event Planning Tips
              </h2>
              <p className="text-xl text-amber-100 mb-8">
                Get expert advice, industry insights, and exclusive offers delivered to your inbox
              </p>
              
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-opacity-50"
                />
                <button
                  type="submit"
                  className="px-8 py-3 bg-white text-amber-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Subscribe
                </button>
              </form>
              
              <p className="text-sm text-amber-100 mt-4">
                No spam, unsubscribe anytime. We respect your privacy.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}