import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import MemberForm from './MemberForm'

function EditMember() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [member, setMember] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('id', id)
        .single()
      if (error) setError(error.message)
      else setMember(data)
    }
    load()
  }, [id])

  const handleUpdate = async (values) => {
    setSaving(true)
    setError('')
    const { error } = await supabase.from('members').update(values).eq('id', id)
    setSaving(false)
    if (error) return setError(error.message)
    navigate('/members')
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-black text-zinc-500 text-sm flex items-center justify-center">
        {error || 'Loading member...'}
      </div>
    )
  }

  return (
    <MemberForm
      title="Edit Member"
      submitLabel="Update Member"
      initial={{
        full_name: member.full_name || '',
        email: member.email || '',
        phone: member.phone || '',
        plan: member.plan || 'Monthly',
        status: member.status || 'Active',
        join_date: member.join_date || new Date().toISOString().slice(0, 10),
      }}
      saving={saving}
      error={error}
      onSubmit={handleUpdate}
      onCancel={() => navigate('/members')}
    />
  )
}

export default EditMember