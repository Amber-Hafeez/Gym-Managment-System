const unsplash = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=70&w=${w}`

const pexels = (id, w = 800) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`

export const IMAGES = {
  // Dashboard, landing, login
  gymRack: unsplash('1609674248079-e9242e48c06b', 1600),
  womanGym: unsplash('1546483875-ad9014c88eba', 800),
  manDumbbell: unsplash('1641337221253-fdc7237f6b61', 800),
  gymMachines: unsplash('1681040517791-aba993f05b2b', 800),
  gymDark: unsplash('1637430308606-86576d8fef3c', 1600),
  gymBrick: unsplash('1656774950484-f29fc71db852', 1600),
}

// Plans page photos: har plan ki apni photo.
// Badalne ke liye sirf number change karein.
export const PLAN_PHOTOS = {
  Monthly: pexels(26776015),
  Quarterly: pexels(37955639),
  'Half-Yearly': pexels(34587497),
  Yearly: pexels(6551097),
}