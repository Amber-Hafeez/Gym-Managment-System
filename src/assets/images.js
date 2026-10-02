const unsplash = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=70&w=${w}`

export const IMAGES = {
  // Dashboard
  gymRack: unsplash('1609674248079-e9242e48c06b', 1600),      // dumbbells on rack (hero)
  womanGym: unsplash('1534438327276-14e5300c3a48', 800),      // Total Members card
  manDumbbell: unsplash('1674834727149-00812f907676', 800),   // Active Members card
  gymMachines: unsplash('1689877020200-403d8542d95d', 800),   // Trainers card

  // For landing + login pages later
  gymDark: unsplash('1637430308606-86576d8fef3c', 1600),
  gymBrick: unsplash('1656774950484-f29fc71db852', 1600),
}