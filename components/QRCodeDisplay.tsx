'use client'

import { QRCodeSVG } from 'qrcode.react'

export default function QRCodeDisplay({ code }: { code: string }) {
  return (
    <div className="flex flex-col items-center p-4 bg-white border rounded shadow-sm">
      <QRCodeSVG value={code} size={128} />
      <div className="mt-2 text-sm font-mono font-bold text-gray-700 tracking-widest">{code}</div>
      <div className="text-xs text-gray-500 mt-1 text-center">Show this to the rider</div>
    </div>
  )
}
