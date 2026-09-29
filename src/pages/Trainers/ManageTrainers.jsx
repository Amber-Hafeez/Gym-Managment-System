import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabaseClient'
import { useTrainers, useCreateTrainer, useUpdateTrainer, useDeleteTrainer } from '../../hooks/useManageTrainers'

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

const statusStyle = {
  approved: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40',
  pending: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/40',
  rejected: 'bg-red-500/15 text-red-400 border-red-500/40',
}

export default function ManageTrainers() {
  const queryClient = useQueryClient()
  const { data: trainers, isLoading } = useTrainers()
  const createTrainer = useCreateTrainer()
  const updateTrainer = useUpdateTrainer()
  const deleteTrainer = useDeleteTrainer()

  // Pending trainer requests
  const { data: pending, error: pendingError } = useQuery({
    queryKey: ['pending-trainers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .ilike('role', 'trainer')
        .eq('status', 'pending')
      if (error) throw error
      return data
    },
  })

  const setStatus = useMutation({
    mutationFn: async ({ id, status }) => {
      const { error } = await supabase.from('profiles').update({ status }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries(),
  })

  const empty = {
    full_name: '',
    email: '',
    phone: '',
    specialization: '',
    experience_years: '',
    status: 'approved',
    password: '',
    confirm: '',
  }
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const inputClass =
    'w-full px-3 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition'
  const labelClass = 'block text-xs text-zinc-400 mb-1.5'

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  // Sirf approved trainers main list me dikhao
  const approvedTrainers = trainers?.filter((t) => t.status !== 'pending' && t.status !== 'rejected')

  const extras = () => ({
    specialization: form.specialization,
    experience_years: form.experience_years !== '' ? Number(form.experience_years) : null,
    status: form.status,
  })

  const finish = () => {
    queryClient.invalidateQueries()
    setSaving(false)
    closeForm()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!editingId && form.password !== form.confirm) {
      setError('Passwords match nahi kar rahe.')
      return
    }

    setSaving(true)

    if (editingId) {
      updateTrainer.mutate(
        { id: editingId, full_name: form.full_name.trim(), phone: form.phone.trim() },
        {
          onSuccess: async () => {
            const { error: extraError } = await supabase.from('profiles').update(extras()).eq('id', editingId)
            if (extraError) {
              setError(extraError.message)
              setSaving(false)
              return
            }
            finish()
          },
          onError: (err) => {
            setError(err.message)
            setSaving(false)
          },
        }
      )
    } else {
      const email = form.email.trim()
      createTrainer.mutate(
        { full_name: form.full_name.trim(), email, password: form.password, phone: form.phone.trim() },
        {
          onSuccess: async () => {
            const { error: extraError } = await supabase.from('profiles').update(extras()).eq('email', email)
            if (extraError) {
              setError(extraError.message)
              setSaving(false)
              return
            }
            finish()
          },
          onError: (err) => {
            setError(err.message)
            setSaving(false)
          },
        }
      )
    }
  }

  const startEdit = (t) => {
    setEditingId(t.id)
    setForm({
      full_name: t.full_name || '',
      email: t.email || '',
      phone: t.phone || '',
      specialization: t.specialization || '',
      experience_years: t.experience_years ?? '',
      status: t.status || 'approved',
      password: '',
      confirm: '',
    })
    setShowForm(true)
  }

  const closeForm = () => {
    setForm(empty)
    setEditingId(null)
    setShowForm(false)
    setShowPass(false)
    setError('')
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Manage Trainers</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-emerald-500 text-black font-semibold rounded-lg px-4 py-2 text-sm hover:bg-emerald-400 transition"
        >
          + Add Trainer
        </button>
      </div>

      {/* PENDING REQUESTS */}
      {pendingError && (
        <p className="text-sm text-red-400 bg-red-950 border border-red-900 rounded-lg px-3 py-2 mb-6">
          Pending requests load nahi hui: {pendingError.message}
        </p>
      )}

      <div className="mb-8 border border-emerald-500/40 bg-emerald-500/5 rounded-lg p-4 md:p-5">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold text-white">Pending Requests</h2>
          <span className="text-xs font-bold bg-emerald-500 text-black rounded-full px-2 py-0.5">
            {pending?.length ?? 0}
          </span>
        </div>

        {pending?.length > 0 ? (
          <div className="space-y-3">
            {pending.map((p) => (
              <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-sm">
                  <p className="font-semibold text-white">{p.full_name}</p>
                  <p className="text-zinc-400">{p.email} · {p.phone || '—'}</p>
                  <p className="text-zinc-500 text-xs mt-1">
                    {p.specialization || 'No specialization'}
                    {p.experience_years != null && ` · ${p.experience_years} yrs experience`}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setStatus.mutate({ id: p.id, status: 'approved' })}
                    disabled={setStatus.isPending}
                    className="px-4 py-2 rounded-md bg-emerald-500 text-black text-sm font-semibold hover:bg-emerald-400 disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => setStatus.mutate({ id: p.id, status: 'rejected' })}
                    disabled={setStatus.isPending}
                    className="px-4 py-2 rounded-md border border-red-500/50 text-red-400 text-sm font-semibold hover:bg-red-500/10 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500">No pending requests.</p>
        )}

        {setStatus.isError && (
          <p className="text-sm text-red-400 mt-3">{setStatus.error.message}</p>
        )}
      </div>

      {/* TRAINERS TABLE */}
      {isLoading ? (
        <p className="text-zinc-500 text-sm">Loading...</p>
      ) : (
        <div className="border border-zinc-800 rounded-lg overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead className="bg-zinc-900 text-zinc-400">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-4 py-3 font-medium">Phone</th>
                <th className="text-left px-4 py-3 font-medium">Specialization</th>
                <th className="text-left px-4 py-3 font-medium">Exp.</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {approvedTrainers?.map((t) => (
                <tr key={t.id} className="text-zinc-200">
                  <td className="px-4 py-3">{t.full_name}</td>
                  <td className="px-4 py-3 text-zinc-400">{t.email}</td>
                  <td className="px-4 py-3 text-zinc-400">{t.phone || '—'}</td>
                  <td className="px-4 py-3 text-zinc-400">{t.specialization || '—'}</td>
                  <td className="px-4 py-3 text-zinc-400">{t.experience_years != null ? `${t.experience_years} yrs` : '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold border rounded-full px-2.5 py-1 ${statusStyle[t.status || 'approved']}`}>
                      {t.status || 'approved'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-3 whitespace-nowrap">
                    <button onClick={() => startEdit(t)} className="text-zinc-300 hover:text-white text-xs font-medium">Edit</button>
                    <button onClick={() => deleteTrainer.mutate(t.id)} className="text-red-400 hover:text-red-300 text-xs font-medium">Remove</button>
                  </td>
                </tr>
              ))}
              {approvedTrainers?.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-6 text-center text-zinc-500">No trainers yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ADD / EDIT TRAINER FORM (popup) */}
      {showForm &&
        createPortal(
          <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/70" onClick={closeForm}>
            <div className="min-h-full flex items-start sm:items-center justify-center p-3 sm:p-6">
              <form
                onClick={(e) => e.stopPropagation()}
                onSubmit={handleSubmit}
                className="w-full max-w-lg my-2 bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-8"
              >
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-lg sm:text-xl font-extrabold text-white">
                    {editingId ? 'Edit Trainer' : 'Add New Trainer'}
                  </h2>
                  <button type="button" onClick={closeForm} className="w-8 h-8 grid place-items-center rounded-lg text-zinc-400 hover:bg-zinc-800">
                    ✕
                  </button>
                </div>
                <p className="text-sm text-zinc-400 mb-4">
                  {editingId ? 'Trainer ki details update karo' : 'Naya trainer account banao'}
                </p>

                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className={labelClass}>Full name</label>
                    <input name="full_name" value={form.full_name} onChange={handleChange} placeholder="e.g. Ali Khan" required className={inputClass} />
                  </div>

                  <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Email</label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="trainer@gmail.com"
                        required
                        disabled={Boolean(editingId)}
                        className={inputClass + (editingId ? ' opacity-60' : '')}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Phone</label>
                      <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="03XX XXXXXXX" required className={inputClass} />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
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
                    <label className={labelClass}>Status</label>
                    <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  {!editingId && (
                    <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
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
                            className={inputClass + ' pr-14'}
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
                    </div>
                  )}
                </div>

                {error && (
                  <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 mt-4">{error}</p>
                )}

                <div className="flex gap-3 mt-5">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-2.5 rounded-lg bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition disabled:opacity-60"
                  >
                    {saving ? 'Saving...' : editingId ? 'Update Trainer' : 'Add Trainer'}
                  </button>
                  <button type="button" onClick={closeForm} className="px-5 py-2.5 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-900">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}