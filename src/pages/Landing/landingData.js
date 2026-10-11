export const navLinks = [
  { id: 'features', label: 'Features' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'how', label: 'How it works' },
  { id: 'roles', label: 'Roles' },
  { id: 'pricing', label: 'Plans' },
]

export const features = [
  { icon: '👥', title: 'Member Management', text: 'Add, edit and search members. Every profile shows plan, expiry, attendance and payments.' },
  { icon: '📋', title: 'Membership Plans', text: 'Monthly, Quarterly and Yearly plans with automatic expiry date calculation.' },
  { icon: '🗓️', title: 'Class Scheduling', text: 'Create classes with trainer, day, time and seat capacity in seconds.' },
  { icon: '🎟️', title: 'Live Booking + Waitlist', text: 'Seat counts update in real time. Full classes automatically use a waitlist.' },
  { icon: '✅', title: 'Smart Check-In', text: 'One-click daily check-in that blocks members whose plan has expired.' },
  { icon: '💳', title: 'Payments & Renewals', text: 'Record cash or card payments and renew plans without re-entering details.' },
  { icon: '📊', title: 'Owner Dashboard', text: 'Active members, expiring soon, today check-ins and monthly revenue at a glance.' },
  { icon: '🔥', title: 'Streaks & Reminders', text: 'Check-in streaks keep members motivated. Fee reminder banners prevent missed renewals.' },
]

export const steps = [
  { n: '01', title: 'Add your members', text: 'Register members with name, phone and join date.' },
  { n: '02', title: 'Assign a plan', text: 'Pick a plan and the expiry date is calculated for you.' },
  { n: '03', title: 'Run your gym daily', text: 'Book classes, check members in and track payments.' },
]

export const roles = [
  {
    icon: '🛡️',
    title: 'Admin (Owner / Front Desk)',
    points: ['Manage members, plans and trainers', 'Schedule classes and book members', 'Handle payments, renewals and reports'],
  },
  {
    icon: '🏋️',
    title: 'Trainer',
    points: ['See only your own assigned classes', 'View booked and waitlisted members', 'Mark attendance for your classes'],
  },
]

export const IMG = {
  hero: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80',
  banner: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=1400&q=80',
  cta: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1400&q=80',
}

export const gallery = [
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80',
]

export const planTabs = ['All Plans', 'Monthly', 'Quarterly', 'Half-Yearly', 'Yearly']

export const plans = [
  {
    name: 'Monthly',
    price: 3000,
    days: 30,
    label: '1 month access',
    features: ['🏋️ Gym Access', '👥 Group Classes', '🛡️ Basic Support'],
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=80',
    hot: false,
  },
  {
    name: 'Quarterly',
    price: 8000,
    days: 90,
    label: '3 months access',
    features: ['🏋️ Gym Access', '👥 Group Classes', '🥗 Diet Guidance'],
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
    hot: true,
  },
  {
    name: 'Half-Yearly',
    price: 15000,
    days: 180,
    label: '6 months access',
    features: ['🏋️ Gym Access', '👥 Group Classes', '🧑‍🏫 Trainer Support'],
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=600&q=80',
    hot: false,
  },
  {
    name: 'Yearly',
    price: 28000,
    days: 365,
    label: '12 months access',
    features: ['🏋️ Gym Access', '👥 Group Classes', '⭐ Priority Support'],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
    hot: false,
  },
]