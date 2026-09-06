'use client'

import Link from 'next/link'

export function Header() {
  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-600">🏛️</span>
          <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition">
            Maa Kantabausuni
          </Link>
        </div>
        <div className="flex gap-6 items-center">
          <Link href="/" className="text-gray-600 hover:text-gray-900 transition">
            Home
          </Link>
          <Link href="#" className="text-gray-600 hover:text-gray-900 transition">
            About
          </Link>
          <Link href="#" className="text-gray-600 hover:text-gray-900 transition">
            Records
          </Link>
          <Link href="#" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Contact
          </Link>
        </div>
      </nav>
    </header>
  )
}
