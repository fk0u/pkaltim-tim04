export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-green-500">BorneoTrip</h3>
            <p className="text-gray-400 max-w-sm">
              Menjelajahi Kalimantan Timur melalui event budaya, alam, dan paket wisata berkelanjutan yang mendukung lingkungan dan masyarakat lokal.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Eksplorasi</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/events" className="hover:text-green-400">Event Tahunan</a></li>
              <li><a href="/packages" className="hover:text-green-400">Paket Wisata</a></li>
              <li><a href="/itinerary" className="hover:text-green-400">Rekomendasi Itinerary</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Tentang</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/sustainability" className="hover:text-green-400">Sustainability</a></li>
              <li><a href="/community" className="hover:text-green-400">Community Impact</a></li>
              <li><a href="/contact" className="hover:text-green-400">Hubungi Kami</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>© 2026 BorneoTrip. Sustainable Tourism Hackathon Project.</p>
        </div>
      </div>
    </footer>
  );
}
