import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import MemberForm from './MemberForm'

function AddMember() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleAdd = async (values) => {
    setSaving(true)
    setError('')
    const { error } = await supabase.from('members').insert([values])
    setSaving(false)
    if (error) return setError(error.message)
    navigate('/members')
  }

  return (
    <MemberForm
      title="Add New Member"
      submitLabel="Save Member"
      initial={{
        full_name: '',
        email: '',
        phone: '',
        plan: 'Monthly',
        status: 'Active',
        join_date: new Date().toISOString().slice(0, 10),
      }}
      saving={saving}
      error={error}
      onSubmit={handleAdd}
      onCancel={() => navigate('/members')}
    />
  )
}

export default AddMember