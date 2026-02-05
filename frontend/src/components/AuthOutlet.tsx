import { Outlet, Link } from 'react-router-dom'
import { routes } from '../routes/routes'

export default function AuthOutlet() {
  return (
    <div className="h-dvh w-dvw flex flex-col">
      <header className="w-full border-b p-4 h-[10dvh] flex items-center justify-between">
        <Link to={routes.main} className="text-xl font-bold">App</Link>
        <nav className="space-x-3">
          <Link to={routes.login} className="text-blue-600">Login</Link>
          <Link to={routes.register} className="text-green-600">Register</Link>
        </nav>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <Outlet />
      </main>
    </div>
  )
}
