import { useState } from 'react'
import { useTrainers, useCreateTrainer, useUpdateTrainer, useDeleteTrainer } from '../../hooks/useManageTrainers'

export default function ManageTrainers() {
  const { data: trainers, isLoading } = useTrainers()
  const createTrainer = useCreateTrainer()
  const updateTrainer = useUpdateTrainer()
  const deleteTrainer = useDeleteTrainer()

  const empty = { full_name: '', email: '', password: '', phone: '' }
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')

  const inputClass = 'bg-black border border-zinc-700 rounded-md px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-500 w-full'

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (editingId) {
      updateTrainer.mutate({ id: editingId, full_name: form.full_name, phone: form.phone }, {
        onSuccess: () => closeForm(),
        onError: (err) => setError(err.message),
      })
    } else {
      createTrainer.mutate(form, {
        onSuccess: () => closeForm(),
        onError: (err) => setError(err.message),
      })
    }
  }

  const startEdit = (t) => {
    setEditingId(t.id)
    setForm({ full_name: t.full_name, email: t.email, password: '', phone: t.phone || '' })
    setShowForm(true)
  }

  const closeForm = () => {
    setForm(empty)
    setEditingId(null)
    setShowForm(false)
    setError('')
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Manage Trainers</h1>
        {!showForm && (
          <button onClick={() => setShowForm(true)}
            className="bg-white text-black font-medium rounded-md px-4 py-2 text-sm hover:bg-zinc-200 transition-colors">
            + Add Trainer
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-8 space-y-4">
          <h2 className="text-lg font-semibold text-white mb-2">
            {editingId ? 'Edit Trainer' : 'New Trainer'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Full name</label>
              <input value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })} required className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Phone</label>
              <input value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
            </div>
            {!editingId && (
              <>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Email</label>
                  <input type="email" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} required className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Password</label>
                  <input type="password" value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })} required className={inputClass} />
                </div>
              </>
            )}
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={createTrainer.isPending || updateTrainer.isPending}
              className="flex-1 bg-white text-black font-medium rounded-md py-2 text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50">
              {editingId ? 'Update Trainer' : 'Add Trainer'}
            </button>
            <button type="button" onClick={closeForm} className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200">
              Cancel
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <p className="text-zinc-500 text-sm">Loading...</p>
      ) : (
        <div className="border border-zinc-800 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-900 text-zinc-400">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {trainers?.map((t) => (
                <tr key={t.id} className="text-zinc-200">
                  <td className="px-4 py-3">{t.full_name}</td>
                  <td className="px-4 py-3 text-zinc-400">{t.email}</td>
                  <td className="px-4 py-3 text-zinc-400">{t.phone || '—'}</td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button onClick={() => startEdit(t)} className="text-zinc-300 hover:text-white text-xs font-medium">Edit</button>
                    <button onClick={() => deleteTrainer.mutate(t.id)} className="text-red-400 hover:text-red-300 text-xs font-medium">Remove</button>
                  </td>
                </tr>
              ))}
              {trainers?.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-zinc-500">No trainers yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}