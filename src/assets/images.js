const unsplash = (id, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=70&w=${w}`

export const IMAGES = {
  // Dark gym with red lighting and machines
  gymDark: unsplash('1637430308606-86576d8fef3c'),
  // Brick-wall gym with weights
  gymBrick: unsplash('1656774950484-f29fc71db852'),
}