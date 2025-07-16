import React from 'react';
import { ExternalLink, Palette, Sparkles, Eye, Heart, TrendingUp } from 'lucide-react';

function App() {
  const featuredArtworks = [
    {
      id: 1,
      title: "Digital Dreams #001",
      image: "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: "0.5 ETH",
      status: "Available"
    },
    {
      id: 2,
      title: "Cyber Visions #002",
      image: "https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: "0.8 ETH",
      status: "Sold"
    },
    {
      id: 3,
      title: "Abstract Reality #003",
      image: "https://images.pexels.com/photos/1183986/pexels-photo-1183986.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: "1.2 ETH",
      status: "Available"
    },
    {
      id: 4,
      title: "Neon Landscapes #004",
      image: "https://images.pexels.com/photos/1194713/pexels-photo-1194713.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: "0.7 ETH",
      status: "Available"
    },
    {
      id: 5,
      title: "Digital Metamorphosis #005",
      image: "https://images.pexels.com/photos/1183099/pexels-photo-1183099.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: "1.5 ETH",
      status: "Sold"
    },
    {
      id: 6,
      title: "Quantum Art #006",
      image: "https://images.pexels.com/photos/1194775/pexels-photo-1194775.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: "0.9 ETH",
      status: "Available"
    }
  ];

  const stats = [
    { label: "Artworks Created", value: "50+", icon: Palette },
    { label: "Total Sales", value: "25 ETH", icon: TrendingUp },
    { label: "Collectors", value: "120+", icon: Heart },
    { label: "Views", value: "10K+", icon: Eye }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-white/90 text-sm font-medium">Digital Artist & NFT Creator</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
            CANARD
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">3D</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            Exploring the boundaries between reality and imagination through cutting-edge digital art and NFT collections
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="https://rarible.com/canard3d" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
            >
              <span>View Collection on Rarible</span>
              <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            
            <button className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transform hover:scale-105 transition-all duration-300">
              <Eye className="w-5 h-5" />
              <span>Explore Gallery</span>
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Artworks Gallery */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Featured <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Artworks</span>
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Discover my latest digital creations, each piece telling a unique story in the metaverse
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredArtworks.map((artwork, index) => (
              <div 
                key={artwork.id} 
                className="group relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:transform hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={artwork.image} 
                    alt={artwork.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Status Badge */}
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
                    artwork.status === 'Available' 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {artwork.status}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                    {artwork.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {artwork.price}
                    </span>
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-colors border border-purple-500/30">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">View</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            About the <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Artist</span>
          </h2>
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10">
            <p className="text-lg text-white/80 leading-relaxed mb-8">
              Welcome to my digital universe. I'm CANARD3D, a passionate digital artist pushing the boundaries of creativity through NFTs and blockchain technology. Each piece in my collection represents a journey into unexplored realms of imagination, where technology meets artistry.
            </p>
            <p className="text-lg text-white/80 leading-relaxed mb-8">
              My work explores themes of transformation, digital consciousness, and the evolving relationship between humanity and technology. Through vibrant colors, dynamic compositions, and innovative techniques, I create immersive experiences that challenge perception and inspire wonder.
            </p>
            <div className="flex justify-center">
              <a 
                href="https://rarible.com/canard3d" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
              >
                <span>Collect My Art</span>
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">CANARD3D</h3>
            <p className="text-white/60">Digital Artist & NFT Creator</p>
          </div>
          <div className="flex justify-center mb-6">
            <a 
              href="https://rarible.com/canard3d" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20"
            >
              <span>Visit Rarible Collection</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <p className="text-white/40 text-sm">
            © 2025 CANARD3D. All rights reserved. | Exploring digital frontiers through NFT art.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;