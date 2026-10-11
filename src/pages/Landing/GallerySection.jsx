import { gallery } from './landingData'

function GallerySection() {
  const hideBroken = (e) => {
    e.currentTarget.style.display = 'none'
  }

  return (
    <section id="gallery" className="bg-zinc-950 border-y border-zinc-800 scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <p className="text-emerald-400 text-sm font-semibold tracking-wider">INSIDE FITZONE</p>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-2">
            Train in a <span className="text-emerald-400">real gym</span> environment
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {gallery.map((src, i) => (
            <div
              key={i}
              className="aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-800 border border-zinc-800"
            >
              <img
                src={src}
                alt="FITZONE gym"
                loading="lazy"
                onError={hideBroken}
                className="h-full w-full object-cover hover:scale-105 transition duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default GallerySection