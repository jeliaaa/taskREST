import { Link } from 'react-router-dom'
import { routes } from '../routes/routes'

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-center">
      <h1 className="text-4xl font-bold mb-4">404 — Page not found</h1>
      <p className="mb-6 text-gray-600">We couldn't find the page you're looking for.</p>
      <Link to={routes.main} className="px-4 py-2 bg-blue-600 text-white rounded">Go home</Link>
    </div>
  )
}
