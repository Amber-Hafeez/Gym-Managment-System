const unsplash = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=70&w=${w}`

export const IMAGES = {
  // Dashboard
  gymRack: unsplash('1609674248079-e9242e48c06b', 1600),     // hero banner
  womanGym: unsplash('1546483875-ad9014c88eba', 800),        // Total Members card (larki)
  manDumbbell: unsplash('1641337221253-fdc7237f6b61', 800),  // Active Members card (larka)
  gymMachines: unsplash('1681040517791-aba993f05b2b', 800),  // Trainers card (trainer)

  // Landing + login pages ke liye
  gymDark: unsplash('1637430308606-86576d8fef3c', 1600),
  gymBrick: unsplash('1656774950484-f29fc71db852', 1600),
}