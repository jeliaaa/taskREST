import { useState } from 'react'
import { Link } from 'react-router-dom'
import { routes } from '../routes/routes'
import { useAuthStore } from '../stores/authStore'

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const { isAuthenticated, logout } = useAuthStore();


  const links = [
    { to: routes.main, label: 'Home' },
    ...(isAuthenticated ? [{ to: routes.profile, label: 'Profile' }] : []),
  ]

  return (
    <>
      <aside className={`absolute inset-y-0 left-0 w-[10dvw] h-dvh z-100 transform ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 bg-[#0a0a0a] transition-transform`}>
        <div className="p-4 flex items-center justify-between border-b">
          <div className="font-bold">Logo</div>
          <button className="md:hidden p-1 rounded" onClick={() => setOpen(false)} aria-label="Close menu">✕</button>
        </div>

        <nav className="p-4 space-y-2">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="block px-2 py-2 rounded hover:bg-blue-600"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}

          {!isAuthenticated && (
            <>
              <Link to={routes.login} className="block px-2 py-2 rounded hover:bg-blue-600" onClick={() => setOpen(false)}>Login</Link>
              <Link to={routes.register} className="block px-2 py-2 rounded hover:bg-blue-600" onClick={() => setOpen(false)}>Register</Link>
            </>
          )}

          {isAuthenticated && (
            <>
              <div className="border-t my-2" />
              <Link to={routes.settings ?? '#'} className="block px-2 py-2 rounded hover:bg-blue-600" onClick={() => setOpen(false)}>Settings</Link>
              <button onClick={() => { logout(); setOpen(false); }} className="w-full text-left px-2 py-2 rounded hover:bg-red-600 transition">Logout</button>
            </>
          )}
        </nav>
      </aside>
    </>
  )
}
