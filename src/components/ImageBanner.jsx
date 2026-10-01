import { useState } from 'react'

export default function ImageBanner({ src, alt = '', className = '', children }) {
  const [failed, setFailed] = useState(false)

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-950 to-emerald-950 ${className}`}
    >
      {!failed && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
      <div className="relative">{children}</div>
    </div>
  )
}