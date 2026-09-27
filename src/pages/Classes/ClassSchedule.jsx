import { useState } from 'react'
import { useClasses, useSaveClass, useCancelClass } from '../../hooks/useClasses'
import { useTrainers } from '../../hooks/useManageTrainers'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function ClassSchedule() {
  const { data: classes, isLoading } = useClasses()
  const { data: trainers } = useTrainers()
  const saveClass = useSaveClass()
  const cancelClass = useCancelClass()

  const empty = { name: '', trainer_id: '', day_of_week: 'Monday', start_time: '', end_time: '', capacity: 10, }
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    saveClass.mutate({ id: editingId, ...form }, {
      onSuccess: () => {
        setForm(empty)
        setEditingId(null)
        setShowForm(false)
      },
    })
  }

  const startEdit = (cls) => {
    setEditingId(cls.id)
    setForm({
      name: cls.name,
      trainer_id: cls.trainer_id,
      day_of_week: cls.day_of_week,
      start_time: cls.start_time,
      end_time: cls.end_time,
      capacity: cls.capacity,
    })
    setShowForm(true)
  }

  const handleCancelForm = () => {
    setForm(empty)
    setEditingId(null)
    setShowForm(false)
  }

  const inputClass =
    'bg-black border border-zinc-700 rounded-md px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-500 w-full'

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Class Schedule</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-white text-black font-medium rounded-md px-4 py-2 text-sm hover:bg-zinc-200 transition-colors"
          >
            + Create Class
          </button>
        )}
      </div>

      {/* Create/Edit form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-8 space-y-4"
        >
          <h2 className="text-lg font-semibold text-white mb-2">
            {editingId ? 'Edit Class' : 'New Class'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Class name</label>
              <input
                placeholder="e.g. Morning Yoga"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">Trainer</label>
              <select
                value={form.trainer_id}
                onChange={(e) => setForm({ ...form, trainer_id: e.target.value })}
                required
                className={inputClass}
              >
                <option value="">Select trainer</option>
                {trainers?.map((t) => (
                  <option key={t.id} value={t.id}>{t.full_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">Day</label>
              <select
                value={form.day_of_week}
                onChange={(e) => setForm({ ...form, day_of_week: e.target.value })}
                className={inputClass}
              >
                {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">Capacity</label>
              <input
                type="number"
                min="1"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">Start time</label>
              <input
                type="time"
                value={form.start_time}
                onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">End time</label>
              <input
                type="time"
                value={form.end_time}
                onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                required
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saveClass.isPending}
              className="flex-1 bg-white text-black font-medium rounded-md py-2 text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              {saveClass.isPending ? 'Saving...' : editingId ? 'Update Class' : 'Create Class'}
            </button>
            <button
              type="button"
              onClick={handleCancelForm}
              className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Class list */}
      {isLoading ? (
        <p className="text-zinc-500 text-sm">Loading...</p>
      ) : (
        <div className="border border-zinc-800 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-900 text-zinc-400">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Class</th>
                <th className="text-left px-4 py-3 font-medium">Trainer</th>
                <th className="text-left px-4 py-3 font-medium">Day</th>
                <th className="text-left px-4 py-3 font-medium">Time</th>
                <th className="text-left px-4 py-3 font-medium">Capacity</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {classes?.filter((c) => c.status === 'active').map((c) => (
                <tr key={c.id} className="text-zinc-200">
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3 text-zinc-400">{c.profiles?.full_name}</td>
                  <td className="px-4 py-3 text-zinc-400">{c.day_of_week}</td>
                  <td className="px-4 py-3 text-zinc-400">{c.start_time} – {c.end_time}</td>
                  <td className="px-4 py-3 text-zinc-400">{c.capacity}</td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button onClick={() => startEdit(c)} className="text-zinc-300 hover:text-white text-xs font-medium">
                      Edit
                    </button>
                    <button onClick={() => cancelClass.mutate(c.id)} className="text-red-400 hover:text-red-300 text-xs font-medium">
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
              {classes?.filter((c) => c.status === 'active').length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-zinc-500">
                    No classes scheduled yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}