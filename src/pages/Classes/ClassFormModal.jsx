import { useState } from 'react';
import { useTrainers } from '../../hooks/useTrainers';
import { supabase } from '../../lib/supabaseClient';

export default function ClassForm({ onSuccess }) {
  const { data: trainers, isLoading: trainersLoading } = useTrainers();

  const [form, setForm] = useState({
    name: '',
    trainer_id: '',
    day_of_week: '',
    time: '',
    capacity: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('classes').insert({
      name: form.name,
      trainer_id: form.trainer_id,
      day_of_week: form.day_of_week,
      time: form.time,
      capacity: Number(form.capacity),
    });
    if (error) return console.error(error);
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Class name (e.g. Morning Yoga)"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />

      <select
        value={form.trainer_id}
        onChange={(e) => setForm({ ...form, trainer_id: e.target.value })}
        required
        disabled={trainersLoading}
      >
        <option value="">Select trainer</option>
        {trainers?.map((t) => (
          <option key={t.id} value={t.id}>{t.full_name}</option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Day (e.g. Monday)"
        value={form.day_of_week}
        onChange={(e) => setForm({ ...form, day_of_week: e.target.value })}
        required
      />
      <input
        type="time"
        value={form.time}
        onChange={(e) => setForm({ ...form, time: e.target.value })}
        required
      />
      <input
        type="number"
        placeholder="Capacity"
        value={form.capacity}
        onChange={(e) => setForm({ ...form, capacity: e.target.value })}
        required
      />

      <button type="submit">Create Class</button>
    </form>
  );
}