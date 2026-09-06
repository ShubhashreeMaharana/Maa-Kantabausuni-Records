export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <section className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Maa Kantabausuni Records
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          A modern web application for managing and preserving records
        </p>
        <div className="flex gap-4 justify-center">
          <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Get Started
          </button>
          <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition">
            Learn More
          </button>
        </div>
      </section>

      <section className="mt-20 grid md:grid-cols-3 gap-8">
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">🚀 Fast</h2>
          <p className="text-gray-600">
            Built with Next.js 14+ for optimal performance and fast load times.
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">📱 Responsive</h2>
          <p className="text-gray-600">
            Fully responsive design that works seamlessly on all devices.
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">🔒 Secure</h2>
          <p className="text-gray-600">
            Built with security best practices and modern web standards.
          </p>
        </div>
      </section>
    </div>
  )
}
