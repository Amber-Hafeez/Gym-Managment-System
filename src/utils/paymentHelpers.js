export const formatPKR = (n) => `Rs. ${Number(n || 0).toLocaleString('en-PK')}`;

export const todayISO = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

export const formatDate = (d) => {
  if (!d) return '—';
  return new Date(String(d).slice(0, 10) + 'T00:00:00').toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

export const addDays = (iso, n) => {
  const d = new Date(String(iso).slice(0, 10) + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + Number(n));
  return d.toISOString().slice(0, 10);
};

export const maxDate = (a, b) => (a > b ? a : b);

export const daysRemaining = (end) => {
  if (!end) return null;
  const t = new Date(todayISO() + 'T00:00:00');
  const e = new Date(String(end).slice(0, 10) + 'T00:00:00');
  return Math.round((e - t) / 86400000);
};

export const getMemberName = (m) => m?.full_name ?? m?.name ?? 'Unknown';
export const getPlanDuration = (p) => Number(p?.duration_days ?? 0);