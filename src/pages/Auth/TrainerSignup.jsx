import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'

const specializations = [
  'Weight Training',
  'Cardio & HIIT',
  'Yoga',
  'Zumba / Aerobics',
  'CrossFit',
  'Boxing / MMA',
  'Nutrition & Diet',
  'General Fitness',
]

const perks = [
  'See only your own assigned classes',
  'View booked and waitlisted members',
  'Mark attendance for your classes',
]

function TrainerSignup() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    specialization: '',
    experience_years: '',
    password: '',
    confirm: '',
  })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      role: 'trainer',
      status: 'pending',
      specialization: form.specialization,
      experience_years: form.experience_years ? Number(form.experience_years) : null,
    })

    // Log out the user after signup, so they can't log in until approved
    await supabase.auth.signOut()
    setLoading(false)

    if (profileError) {
      setError(profileError.message)
      return
    }

    setDone(true)
  }

  const inputClass =
    'w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition'
  const labelClass = 'block text-sm text-zinc-400 mb-1.5'

  // SUCCESS / PENDING SCREEN
  if (done) {
    return (
      <div className="min-h-screen bg-black text-white grid place-items-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/15 border border-emerald-500 grid place-items-center text-3xl text-emerald-400">
            ✓
          </div>
          <h1 className="text-2xl font-extrabold mt-5">Request submitted!</h1>
          <p className="text-zinc-400 mt-2">
            Your request has been submitted. Once approved, you can log in.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/" className="px-6 py-3 rounded-lg bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition">
              Back to Home
            </Link>
            <Link to="/login" className="px-6 py-3 rounded-lg border border-zinc-700 font-semibold hover:bg-zinc-900 transition">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white grid lg:grid-cols-2">
      {/* LEFT PANEL (sirf desktop) */}
      <div className="hidden lg:flex relative overflow-hidden flex-col justify-between p-12 bg-zinc-950 border-r border-zinc-800">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <Link to="/" className="relative text-2xl font-extrabold tracking-widest text-emerald-400">
          FIT<span className="text-white">ZONE</span>
        </Link>

        <div className="relative">
          <h2 className="text-4xl font-extrabold leading-tight">
            Join our team of <span className="text-emerald-400">trainers.</span>
          </h2>
          <p className="text-zinc-400 mt-4 max-w-md">
            Apply for a trainer account.After Admin approval, you can log in and manage your classes and members.
          </p>
          <ul className="mt-8 space-y-3">
            {perks.map((p) => (
              <li key={p} className="flex gap-3 text-zinc-300">
                <span className="text-emerald-400">✔</span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-zinc-600">© {new Date().getFullYear()} FITZONE</p>
      </div>

      {/* FORM PANEL */}
      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-emerald-400 transition mb-6"
          >
            ← Back to Home
          </Link>

          <h1 className="text-2xl md:text-3xl font-extrabold">Trainer Sign Up</h1>
          <p className="text-zinc-400 mt-1 mb-6">Create your trainer account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelClass}>Full name</label>
              <input name="full_name" value={form.full_name} onChange={handleChange} placeholder="e.g. Ali Khan" required className={inputClass} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@gmail.com" required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="03XX XXXXXXX" required className={inputClass} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Specialization</label>
                <select name="specialization" value={form.specialization} onChange={handleChange} required className={inputClass}>
                  <option value="">Select...</option>
                  {specializations.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Experience (years)</label>
                <input name="experience_years" type="number" min="0" max="50" value={form.experience_years} onChange={handleChange} placeholder="e.g. 3" required className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  minLength={6}
                  required
                  className={inputClass + ' pr-16'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-emerald-400"
                >
                  {showPass ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div>
              <label className={labelClass}>Confirm password</label>
              <input
                name="confirm"
                type={showPass ? 'text' : 'password'}
                value={form.confirm}
                onChange={handleChange}
                placeholder="Repeat password"
                required
                className={inputClass}
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition disabled:opacity-60"
            >
              {loading ? 'Submitting...' : 'Request Trainer Account'}
            </button>
          </form>

          <p className="text-sm text-zinc-400 text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-400 hover:underline">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default TrainerSignup