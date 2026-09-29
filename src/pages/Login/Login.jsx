import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    // Trainer approval check
    const { data: profile } = await supabase
      .from('profiles')
      .select('status')
      .eq('id', data.user.id)
      .single()

    if (profile?.status === 'pending') {
      await supabase.auth.signOut()
      setError('Aapka account abhi admin ki approval ke intezar me hai. Approve hone ke baad login karein.')
      setLoading(false)
      return
    }

    if (profile?.status === 'rejected') {
      await supabase.auth.signOut()
      setError('Aapki trainer request reject ho gayi hai. Admin se rabta karein.')
      setLoading(false)
      return
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-emerald-400 transition mb-4"
        >
          ← Back to Home
        </Link>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold tracking-widest text-emerald-400">
              FIT<span className="text-white">ZONE</span>
            </h1>
            <p className="text-zinc-400 text-sm mt-2">Gym & Fitness Club Management</p>
            <p className="text-zinc-500 text-xs mt-1">Sign in to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-950 border border-red-900 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <p className="text-sm text-zinc-400 text-center mt-6">
            Trainer hain?{' '}
            <Link to="/signup" className="text-emerald-400 hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login