import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

const PLANS = ['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly']
const STATUSES = ['Active', 'Inactive', 'Expired']

const inputCls =
  'w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-white rounded-lg text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500'
const labelCls = 'block text-xs font-medium text-zinc-400 mb-1.5'

function MemberForm({ title, initial, submitLabel, saving, error, onSubmit, onCancel }) {
  const [form, setForm] = useState({ ...initial, photo_url: initial?.photo_url || '' })
  const [photoFile, setPhotoFile] = useState(null)
  const [preview, setPreview] = useState(initial?.photo_url || '')
  const [uploading, setUploading] = useState(false)
  const [photoError, setPhotoError] = useState('')

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const pickPhoto = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoError('')

    if (!file.type.startsWith('image/')) {
      setPhotoError('Sirf image file chunein (JPG, PNG, WEBP).')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setPhotoError('Photo 2 MB se chhoti honi chahiye.')
      return
    }

    setPhotoFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const removePhoto = () => {
    setPhotoFile(null)
    setPreview('')
    setForm({ ...form, photo_url: '' })
  }

  const submit = async (e) => {
    e.preventDefault()
    setPhotoError('')
    let photoUrl = form.photo_url

    if (photoFile) {
      setUploading(true)
      const ext = photoFile.name.split('.').pop()
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

      const { error: upError } = await supabase.storage
        .from('member-photos')
        .upload(path, photoFile, { cacheControl: '3600', upsert: false })

      if (upError) {
        setUploading(false)
        setPhotoError('Photo upload nahi hui: ' + upError.message)
        return
      }

      const { data } = supabase.storage.from('member-photos').getPublicUrl(path)
      photoUrl = data.publicUrl
      setUploading(false)
    }

    onSubmit({ ...form, photo_url: photoUrl, full_name: form.full_name.trim() })
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-xl shadow p-6 space-y-4"
      >
        <h1 className="text-lg font-semibold">{title}</h1>

        <div>
          <label className={labelCls}>Photo (optional)</label>
          <div className="flex items-center gap-4">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-zinc-800 border-2 border-dashed border-zinc-600 text-zinc-500 text-xs grid place-items-center">
                No photo
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="cursor-pointer text-sm bg-zinc-800 hover:bg-zinc-700 px-3 py-2 rounded-lg transition text-center">
                {preview ? 'Change Photo' : 'Choose Photo'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={pickPhoto}
                  className="hidden"
                />
              </label>
              {preview && (
                <button
                  type="button"
                  onClick={removePhoto}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Remove photo
                </button>
              )}
            </div>
          </div>
          {photoError && <p className="text-xs text-red-400 mt-2">{photoError}</p>}
        </div>

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
            disabled={saving || uploading}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-black px-4 py-2 rounded-lg text-sm font-semibold"
          >
            {uploading ? 'Uploading photo...' : saving ? 'Saving...' : submitLabel}
          </button>
        </div>
      </form>
    </div>
  )
}

export default MemberForm