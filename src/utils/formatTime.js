export function formatTime(timeStr) {
  // timeStr is "HH:MM:SS" or "HH:MM" from Postgres `time`
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${m} ${period}`;
}