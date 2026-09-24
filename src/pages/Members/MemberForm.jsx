import { useState } from 'react'

const PLANS = ['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly']
const STATUSES = ['Active', 'Inactive', 'Expired']

const inputCls =
  'w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-white rounded-lg text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500'
const labelCls = 'block text-xs font-medium text-zinc-400 mb-1.5'

function MemberForm({ title, initial, submitLabel, saving, error, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial)

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    onSubmit({ ...form, full_name: form.full_name.trim() })
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-xl shadow p-6 space-y-4"
      >
        <h1 className="text-lg font-semibold">{title}</h1>

        <div>
          <label className={labelCls}>Full Name *</label>
          <input
            name="full_name"
            value={form.full_name}
            onChange={change}
            placeholder="John Doe"
            required
            className={inputCls}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={change}
              placeholder="john@mail.com"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={change}
              placeholder="03XXXXXXXXX"
              className={inputCls}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Plan</label>
            <select name="plan" value={form.plan} onChange={change} className={inputCls}>
              {PLANS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Status</label>
            <select name="status" value={form.status} onChange={change} className={inputCls}>
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelCls}>Join Date</label>
          <input
            type="date"
            name="join_date"
            value={form.join_date}
            onChange={change}
            className={inputCls}
          />
        </div>

        {error && (
          <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="text-sm bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-black px-4 py-2 rounded-lg text-sm font-semibold"
          >
            {saving ? 'Saving...' : submitLabel}
          </button>
        </div>
      </form>
    </div>
  )
}

export default MemberForm