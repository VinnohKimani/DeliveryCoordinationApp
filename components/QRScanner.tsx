'use client'

import { useState } from 'react'
import { Scanner } from '@yudiel/react-qr-scanner'
import { confirmDelivery } from '@/app/rider/actions'
import { QrCode, KeyRound } from 'lucide-react'

export default function QRScanner() {
  const [scanning, setScanning] = useState(false)
  const [manualMode, setManualMode] = useState(false)
  const [manualCode, setManualCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleScan = async (text: string) => {
    if (loading) return
    setLoading(true)
    setError(null)
    setScanning(false)
    setManualMode(false)
    
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
    <div className="w-full">
      {!scanning && !manualMode && !loading && !success && (
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setScanning(true)}
            className="w-full bg-purple-600 text-white py-2.5 rounded-xl font-bold shadow-sm hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
          >
            <QrCode className="w-4 h-4" />
            Scan QR Code
          </button>
          <button
            onClick={() => setManualMode(true)}
            className="w-full bg-slate-100 text-slate-700 py-2.5 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 border border-slate-200"
          >
            <KeyRound className="w-4 h-4" />
            Enter Code Manually
          </button>
        </div>
      )}

      {manualMode && (
        <div className="flex flex-col gap-3">
          <input 
            type="text" 
            placeholder="Enter 6-character code" 
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value.toUpperCase())}
            maxLength={6}
            className="w-full text-center tracking-widest font-mono text-lg py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none uppercase"
          />
          <div className="flex gap-2">
            <button 
              onClick={() => setManualMode(false)}
              className="flex-1 bg-slate-100 text-slate-600 py-2 rounded-xl font-bold hover:bg-slate-200"
            >
              Cancel
            </button>
            <button 
              onClick={() => handleScan(manualCode)}
              disabled={manualCode.length < 1}
              className="flex-1 bg-purple-600 text-white py-2 rounded-xl font-bold hover:bg-purple-700 disabled:opacity-50"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {scanning && (
        <div className="border border-purple-200 rounded-xl overflow-hidden relative shadow-inner">
          <button 
            onClick={() => setScanning(false)}
            className="absolute top-3 right-3 z-10 bg-slate-900/50 hover:bg-slate-900/80 text-white px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-sm transition-all"
          >
            Cancel
          </button>
          <div className="aspect-square w-full relative">
            <Scanner 
              onScan={(result) => {
                if (result && result.length > 0) {
                  handleScan(result[0].rawValue)
                }
              }}
              formats={['qr_code']}
            />
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-4 text-purple-600 font-bold animate-pulse">
          Verifying delivery code...
        </div>
      )}

      {error && (
        <div className="mt-4 text-center text-red-600 bg-red-50 border border-red-100 p-3 rounded-xl text-sm font-semibold">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 text-center text-emerald-700 bg-emerald-50 border border-emerald-100 p-3 rounded-xl font-bold">
          {success}
        </div>
      )}
    </div>
  )
}
