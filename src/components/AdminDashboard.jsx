'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import BlogManagement from './BlogManagement'
import AdminCalendar from './AdminCalendar'
import GalleryManagement from './GalleryManagement'
import dynamic from 'next/dynamic'

// Dynamically import jsPDF to avoid SSR issues
const loadJsPDF = async () => {
  const jsPDF = (await import('jspdf')).default
  const autoTable = (await import('jspdf-autotable')).default
  return { jsPDF, autoTable }
}
import { 
  Users, 
  Mail, 
  Phone, 
  Calendar, 
  MessageSquare, 
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Archive,
  Filter,
  Download,
  Eye,
  X,
  FileText,
  BarChart3,
  Trash2,
  ImageIcon
} from 'lucide-react'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [submissions, setSubmissions] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    converted: 0,
    recent: 0
  })
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: 'all',
    startDate: '',
    endDate: ''
  })
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState({})

  // Tab configuration
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'calendar', label: 'Calendar Management', icon: Calendar },
    { id: 'blog', label: 'Blog Management', icon: FileText },
    { id: 'gallery', label: 'Gallery Management', icon: ImageIcon }
  ]

  // Fetch submissions and stats
  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch stats
      const statsResponse = await fetch('/api/admin/submissions?action=stats')
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }

      // Fetch submissions with filters
      const filterParams = new URLSearchParams()
      if (filters.status !== 'all') filterParams.append('status', filters.status)
      if (filters.startDate) filterParams.append('startDate', filters.startDate)
      if (filters.endDate) filterParams.append('endDate', filters.endDate)

      const submissionsResponse = await fetch(`/api/admin/submissions?${filterParams}`)
      if (submissionsResponse.ok) {
        const submissionsData = await submissionsResponse.json()
        setSubmissions(submissionsData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Update submission status
  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`/api/admin/submissions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        // Refresh data
        fetchData()
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  // Delete individual submission
  const handleDeleteSubmission = async (submissionId) => {
    if (!confirm('Are you sure you want to delete this contact submission? This action cannot be undone.')) {
      return
    }

    setDeleteLoading(prev => ({ ...prev, [submissionId]: true }))

    try {
      const response = await fetch(`/api/admin/contacts?id=${submissionId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Remove the deleted submission from the state immediately
        setSubmissions(prev => prev.filter(submission => submission.id !== submissionId))
        alert('Contact submission deleted successfully!')
        // Refresh data after a short delay to ensure consistency
        setTimeout(() => {
          fetchData()
        }, 500)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete submission')
      }
    } catch (error) {
      console.error('Error deleting submission:', error)
      alert(`Failed to delete submission: ${error.message}`)
    } finally {
      setDeleteLoading(prev => ({ ...prev, [submissionId]: false }))
    }
  }

  // Export data to PDF
  const exportToPDF = async () => {
    try {
      // Dynamically load jsPDF to avoid SSR issues
      const { jsPDF } = await loadJsPDF()
      
      // Create new PDF document
      const doc = new jsPDF()
      
      // Add company header
      doc.setFontSize(20)
      doc.setTextColor(217, 123, 21) // Gold color
      doc.text('TVS Event Center - Contact Submissions', 20, 20)
      
      // Add generation date
      doc.setFontSize(10)
      doc.setTextColor(100)
      const currentDate = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
      doc.text(`Generated on: ${currentDate}`, 20, 30)
      
      // Add summary statistics
      doc.setFontSize(12)
      doc.setTextColor(0)
      doc.text(`Total Submissions: ${submissions.length}`, 20, 45)
      
      const newCount = submissions.filter(s => s.status === 'New').length
      const contactedCount = submissions.filter(s => s.status === 'Contacted').length
      const convertedCount = submissions.filter(s => s.status === 'Converted').length
      
      doc.text(`New: ${newCount} | Contacted: ${contactedCount} | Converted: ${convertedCount}`, 20, 55)
      
      // Filter submissions based on current filters
      const filteredSubmissions = submissions.filter(submission => {
        const statusMatch = filters.status === 'all' || submission.status === filters.status
        const startDateMatch = !filters.startDate || new Date(submission.created_at) >= new Date(filters.startDate)
        const endDateMatch = !filters.endDate || new Date(submission.created_at) <= new Date(filters.endDate)
        return statusMatch && startDateMatch && endDateMatch
      })
      
      if (filteredSubmissions.length === 0) {
        alert('No submissions found with current filters.')
        return
      }
      
      // Prepare data for table
      const tableData = filteredSubmissions.map(submission => [
        String(submission.name || 'N/A'),
        String(submission.email || 'N/A'),
        String(submission.phone || 'N/A'),
        String(submission.event_type || 'N/A'),
        submission.event_date ? new Date(submission.event_date).toLocaleDateString('en-US') : 'N/A',
        String(submission.guest_count || 'N/A'),
        String(submission.budget_range || 'N/A'),
        String(submission.status || 'New'),
        submission.created_at ? new Date(submission.created_at).toLocaleDateString('en-US') : 'N/A'
      ])
      
      // Create manual table since autoTable might have issues
      let yPosition = 70
      const pageHeight = doc.internal.pageSize.height
      const lineHeight = 6
      
      // Table headers
      doc.setFillColor(217, 123, 21) // Gold color
      doc.rect(20, yPosition, 170, 8, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      
      const headers = ['Name', 'Email', 'Phone', 'Event', 'Date', 'Guests', 'Budget', 'Status', 'Submitted']
      const columnWidths = [25, 35, 20, 20, 18, 12, 20, 15, 18]
      let xPosition = 20
      
      headers.forEach((header, index) => {
        doc.text(header, xPosition + 2, yPosition + 5)
        xPosition += columnWidths[index]
      })
      
      yPosition += 8
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      
      // Table rows
      tableData.forEach((row, rowIndex) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 30) {
          doc.addPage()
          yPosition = 30
        }
        
        // Alternate row colors
        if (rowIndex % 2 === 0) {
          doc.setFillColor(249, 250, 251)
          doc.rect(20, yPosition, 170, lineHeight, 'F')
        }
        
        xPosition = 20
        row.forEach((cell, cellIndex) => {
          const cellText = String(cell).length > 15 ? String(cell).substring(0, 15) + '...' : String(cell)
          doc.text(cellText, xPosition + 2, yPosition + 4)
          xPosition += columnWidths[cellIndex]
        })
        
        yPosition += lineHeight
      })
      
      // Add footer
      const pageCount = doc.internal.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(100)
        doc.text(`TVS Event Center | Page ${i} of ${pageCount}`, 20, doc.internal.pageSize.height - 10)
        doc.text('Confidential - For Internal Use Only', doc.internal.pageSize.width - 70, doc.internal.pageSize.height - 10)
      }
      
      // Generate filename with current date
      const fileName = `TVS-Event-Center-Leads-${new Date().toISOString().split('T')[0]}.pdf`
      
      // Save the PDF
      doc.save(fileName)
      
      console.log('PDF exported successfully!')
      
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert(`Error generating PDF: ${error.message || 'Unknown error'}. Please try again.`)
    }
  }

  useEffect(() => {
    fetchData()
  }, [filters])

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'contacted': return 'bg-yellow-100 text-yellow-800'
      case 'converted': return 'bg-green-100 text-green-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'new': return <AlertCircle className="w-4 h-4" />
      case 'contacted': return <Clock className="w-4 h-4" />
      case 'converted': return <CheckCircle className="w-4 h-4" />
      case 'archived': return <Archive className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your website content, contact submissions, and blog posts.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-amber-500 text-amber-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' ? (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Contact Submissions
              </h2>
              <p className="text-gray-600">
                Manage and track all contact form submissions from your website.
              </p>
            </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New</p>
                <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-blue-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Contacted</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.contacted}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Converted</p>
                <p className="text-2xl font-bold text-green-600">{stats.converted}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Last 30 Days</p>
                <p className="text-2xl font-bold text-purple-600">{stats.recent}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </motion.div>
        </div>

        {/* Filters and Export */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="converted">Converted</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={exportToPDF}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500" />
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center p-12">
                <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No submissions found.</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Budget
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {submission.name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {submission.email}
                          </div>
                          {submission.phone && (
                            <div className="text-sm text-gray-500 flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {submission.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          {submission.event_type && (
                            <div className="text-sm text-gray-900">
                              {submission.event_type}
                            </div>
                          )}
                          {submission.event_date && (
                            <div className="text-sm text-gray-500">
                              {new Date(submission.event_date).toLocaleDateString('en-GB')}
                            </div>
                          )}
                          {submission.guest_count && (
                            <div className="text-sm text-gray-500">
                              {submission.guest_count} guests
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {submission.budget_range || 'Not specified'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                          {getStatusIcon(submission.status)}
                          <span className="ml-1 capitalize">{submission.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(submission.created_at).toLocaleDateString('en-GB')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setSelectedSubmission(submission)
                              setShowModal(true)
                            }}
                            className="text-gold-600 hover:text-gold-900 p-1"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <select
                            value={submission.status}
                            onChange={(e) => updateStatus(submission.id, e.target.value)}
                            className="text-sm border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="converted">Converted</option>
                            <option value="archived">Archived</option>
                          </select>
                          <button
                            onClick={() => handleDeleteSubmission(submission.id)}
                            disabled={deleteLoading[submission.id]}
                            className="text-red-600 hover:text-red-900 disabled:text-red-400 disabled:cursor-not-allowed p-1"
                            title="Delete Submission"
                          >
                            {deleteLoading[submission.id] ? (
                              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
          </div>
        ) : activeTab === 'calendar' ? (
          <AdminCalendar />
        ) : activeTab === 'blog' ? (
          <BlogManagement />
        ) : activeTab === 'gallery' ? (
          <GalleryManagement />
        ) : null}
      </div>

      {/* Modal for viewing submission details */}
      {showModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Submission Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedSubmission.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedSubmission.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedSubmission.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Event Type</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedSubmission.event_type || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Event Date</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedSubmission.event_date ? new Date(selectedSubmission.event_date).toLocaleDateString('en-GB') : 'Not specified'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Guest Count</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedSubmission.guest_count || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Budget Range</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedSubmission.budget_range || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedSubmission.status)}`}>
                    {getStatusIcon(selectedSubmission.status)}
                    <span className="ml-1 capitalize">{selectedSubmission.status}</span>
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {selectedSubmission.message || 'No message provided'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                <div>
                  <label className="block font-medium">Submitted</label>
                  <p>{new Date(selectedSubmission.created_at).toLocaleString('en-GB')}</p>
                </div>
                <div>
                  <label className="block font-medium">Last Updated</label>
                  <p>{selectedSubmission.updated_at ? new Date(selectedSubmission.updated_at).toLocaleString('en-GB') : 'Never'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard