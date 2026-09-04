'use client'

import { useState } from 'react'
import { Scanner } from '@yudiel/react-qr-scanner'
import { confirmDelivery } from '@/app/rider/actions'

export default function QRScanner() {
  const [scanning, setScanning] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleScan = async (text: string) => {
    if (loading) return
    setLoading(true)
    setError(null)
    setScanning(false)
    try {
      const result = await confirmDelivery(text)
      if (result.success) {
        setSuccess('Delivery confirmed successfully!')
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(result.error || 'Invalid QR code')
      }
    } catch (e: any) {
      setError(e.message || 'An error occurred')
    }
    setLoading(false)
  }

  return (
    <div className="mt-4">
      {!scanning && !loading && !success && (
        <button
          onClick={() => setScanning(true)}
          className="w-full bg-green-600 text-white py-2 rounded font-medium hover:bg-green-700"
        >
          Scan Customer QR Code
        </button>
      )}

      {scanning && (
        <div className="border rounded overflow-hidden relative">
          <button 
            onClick={() => setScanning(false)}
            className="absolute top-2 right-2 z-10 bg-red-600 text-white px-2 py-1 rounded text-xs"
          >
            Cancel
          </button>
          <Scanner 
            onScan={(result) => {
              if (result && result.length > 0) {
                handleScan(result[0].rawValue)
              }
            }}
            formats={['qr_code']}
          />
        </div>
      )}

      {loading && (
        <div className="text-center py-4 text-blue-600 font-medium animate-pulse">
          Verifying delivery code...
        </div>
      )}

      {error && (
        <div className="mt-2 text-center text-red-600 bg-red-50 p-2 rounded text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-2 text-center text-green-700 bg-green-100 p-2 rounded font-medium">
          {success}
        </div>
      )}
    </div>
  )
}
