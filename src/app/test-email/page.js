'use client'

import { useState } from 'react'

export default function EmailTestPage() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testEmail = async () => {
    setLoading(true)
    setResult('')
    
    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const data = await response.json()
      
      if (data.success) {
        setResult('✅ Email sent successfully! Check sony@echo5digital.com and shani@echo5digital.com')
      } else {
        setResult('❌ Error: ' + data.error)
      }
    } catch (error) {
      setResult('❌ Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Email Test</h1>
        
        <div className="text-center">
          <button
            onClick={testEmail}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Test Email Notification'}
          </button>
          
          {result && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm">{result}</p>
            </div>
          )}
          
          <div className="mt-6 text-sm text-gray-600">
            <p><strong>Test will send emails to:</strong></p>
            <ul className="list-disc list-inside mt-2">
              <li>shani@echo5digital.com</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}