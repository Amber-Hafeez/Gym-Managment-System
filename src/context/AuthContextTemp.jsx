import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)

  // Profile load karo. User tabhi set hoga jab profile ho aur approved ho.
  async function applySession(session) {
    if (!session?.user) {
      setUser(null)
      setRole(null)
      setStatus(null)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, status')
      .eq('id', session.user.id)
      .single()

    // Profile nahi hai (signup ke beech) ya pending / rejected: app me enter nahi
    if (!profile || profile.status === 'pending' || profile.status === 'rejected') {
      setUser(null)
      setRole(null)
      setStatus(profile?.status ?? null)
      return
    }

    setUser(session.user)
    setRole(profile.role ?? null)
    setStatus(profile.status ?? 'approved')
  }

  useEffect(() => {
    async function loadSession() {
      const { data: { session } } = await supabase.auth.getSession()
      await applySession(session)
      setLoading(false)
    }
    loadSession()

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await applySession(session)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, role, status, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}