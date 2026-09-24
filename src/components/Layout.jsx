import { NavLink, Outlet } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/members', label: 'Members', icon: '👥' },
  { to: '/trainers', label: 'Trainers', icon: '🏋️' },
  { to: '/payments', label: 'Payments', icon: '💳' },
  { to: '/attendance', label: 'Attendance', icon: '✅' },
]

const linkCls = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
    isActive
      ? 'bg-emerald-500/15 text-emerald-400'
      : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
  }`

function Layout() {
  return (
    <div className="min-h-screen bg-black text-white md:flex">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex md:w-60 shrink-0 flex-col bg-zinc-900 border-r border-zinc-800 p-4 sticky top-0 h-screen">
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-9 h-9 rounded-lg bg-emerald-500 text-black font-extrabold grid place-items-center">
            F
          </div>
          <div>
            <p className="text-lg font-extrabold tracking-widest text-emerald-400 leading-none">
              FIT<span className="text-white">ZONE</span>
            </p>
            <p className="text-[11px] text-zinc-500 mt-1">Gym & Fitness Club</p>
          </div>
        </div>

        <nav className="space-y-1 flex-1">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkCls}>
              <span>{l.icon}</span>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={() => supabase.auth.signOut()}
          className="text-sm text-zinc-400 hover:text-red-400 text-left px-3 py-2.5"
        >
          ⎋ Log out
        </button>
      </aside>

      <div className="flex-1 min-w-0">
        {/* Top nav (mobile) */}
        <div className="md:hidden bg-zinc-900 border-b border-zinc-800 px-4 pt-3">
          <p className="text-lg font-extrabold tracking-widest text-emerald-400">
            FIT<span className="text-white">ZONE</span>
          </p>
          <nav className="flex gap-1 overflow-x-auto py-2">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkCls}>
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <Outlet />
      </div>
    </div>
  )
}

export default Layout