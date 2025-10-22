"use client"

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, SlidersHorizontal, ShoppingCart, Eye } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import BubbleAnimation from '@/components/BubbleAnimation'

interface Asset {
  id: number
  name: string
  type: string
  price: string
  image: string
  rarity: string
  game: string
}

const allAssets: Asset[] = [
  {
    id: 1,
    name: "Cyber Katana X-7",
    type: "Weapon",
    price: "2.5 STT",
    image: "/katana.png",
    rarity: "Legendary",
    game: "CyberStrike",
  },
  {
    id: 2,
    name: "Neon Dragon Skin",
    type: "Skin",
    price: "1.8 STT",
    image: "/neon dragon skin.jpeg",
    rarity: "Epic",
    game: "DragonVerse",
  },
  {
    id: 3,
    name: "Quantum Armor Set",
    type: "Armor",
    price: "3.2 STT",
    image: "/quantum armor suit.jpg",
    rarity: "Legendary",
    game: "QuantumWarriors",
  },
  {
    id: 4,
    name: "Plasma Blaster Pro",
    type: "Weapon",
    price: "1.5 STT",
    image: "/Plasma Blaster Pro.jpeg",
    rarity: "Rare",
    game: "SpaceRaiders",
  },
  {
    id: 5,
    name: "Holographic Phoenix",
    type: "NFT",
    price: "4.0 STT",
    image: "/Holographic Phoenix.jpeg",
    rarity: "Mythic",
    game: "MetaRealms",
  },
  {
    id: 6,
    name: "Stealth Assassin Gear",
    type: "Outfit",
    price: "2.0 STT",
    image: "/Stealth Assassin Gear.jpeg",
    rarity: "Epic",
    game: "ShadowOps",
  },
  {
    id: 7,
    name: "Lightning Strike Bow",
    type: "Weapon",
    price: "1.2 STT",
    image: "/Lightning Strike Bow.jpeg",
    rarity: "Rare",
    game: "ArcherLegends",
  },
  {
    id: 8,
    name: "Cosmic Wings",
    type: "Accessory",
    price: "2.8 STT",
    image: "/Cosmic Wings.jpeg",
    rarity: "Epic",
    game: "SkyRealm",
  },
  {
    id: 9,
    name: "Inferno Blade",
    type: "Weapon",
    price: "3.5 STT",
    image: "/inferno blade.jpeg",
    rarity: "Legendary",
    game: "FireWarriors",
  },
]

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case "Mythic":
      return "bg-gradient-to-r from-purple-500 to-pink-500"
    case "Legendary":
      return "bg-gradient-to-r from-yellow-500 to-orange-500"
    case "Epic":
      return "bg-gradient-to-r from-purple-400 to-blue-500"
    case "Rare":
      return "bg-gradient-to-r from-blue-400 to-cyan-500"
    default:
      return "bg-muted"
  }
}

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedRarity, setSelectedRarity] = useState("all")
  const [sortBy, setSortBy] = useState("featured")

  const addToCart = (asset: Asset) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')

    // Check if item already in cart
    const existingItem = cart.find((item: Asset) => item.id === asset.id)
    if (existingItem) {
      toast.info('Item already in cart!')
      return
    }

    cart.push(asset)
    localStorage.setItem('cart', JSON.stringify(cart))

    // Dispatch custom event for cart update
    window.dispatchEvent(new Event('cartUpdated'))

    toast.success(`${asset.name} added to cart!`)
  }

  const filteredAssets = allAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.game.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || asset.type === selectedType
    const matchesRarity = selectedRarity === "all" || asset.rarity === selectedRarity
    
    return matchesSearch && matchesType && matchesRarity
  })

  return (
    <div className="dark min-h-screen cyber-grid relative">
      <BubbleAnimation />
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            Asset <span className="text-primary">Marketplace</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Discover, buy, and sell premium gaming assets
          </p>
        </div>

        {/* Search and Filters */}
        <div className="glass-effect rounded-lg p-4 md:p-6 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assets or games..."
                className="pl-10 neon-border"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="neon-border">
                <SelectValue placeholder="Asset Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Weapon">Weapons</SelectItem>
                <SelectItem value="Skin">Skins</SelectItem>
                <SelectItem value="Armor">Armor</SelectItem>
                <SelectItem value="NFT">NFTs</SelectItem>
                <SelectItem value="Outfit">Outfits</SelectItem>
                <SelectItem value="Accessory">Accessories</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedRarity} onValueChange={setSelectedRarity}>
              <SelectTrigger className="neon-border">
                <SelectValue placeholder="Rarity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rarities</SelectItem>
                <SelectItem value="Mythic">Mythic</SelectItem>
                <SelectItem value="Legendary">Legendary</SelectItem>
                <SelectItem value="Epic">Epic</SelectItem>
                <SelectItem value="Rare">Rare</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="neon-border">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Showing <span className="text-primary font-bold">{filteredAssets.length}</span> assets
            </p>
            <Button variant="outline" size="sm" className="neon-border">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </div>

        {/* Assets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredAssets.map((asset) => (
            <Card key={asset.id} className="group glass-effect hover:neon-border transition-all duration-300 overflow-hidden h-full flex flex-col">
              <CardHeader className="p-0 relative overflow-hidden">
                <Link href={`/asset/${asset.id}`}>
                  <div className="relative h-48 md:h-56 w-full">
                    <Image
                      src={asset.image}
                      alt={asset.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent"></div>
                    <Badge className={`absolute top-3 right-3 ${getRarityColor(asset.rarity)} border-none text-xs`}>
                      {asset.rarity}
                    </Badge>
                    <Badge variant="secondary" className="absolute top-3 left-3 text-xs">
                      {asset.type}
                    </Badge>
                  </div>
                </Link>
              </CardHeader>
              <CardContent className="p-3 md:p-4 space-y-3 flex-grow">
                <Link href={`/asset/${asset.id}`}>
                  <div>
                    <h3 className="text-base md:text-lg font-bold mb-1" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                      {asset.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">{asset.game}</p>
                  </div>
                </Link>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">Price</div>
                    <div className="text-lg md:text-xl font-bold text-primary" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                      {asset.price}
                    </div>
                  </div>
                  <Link href={`/asset/${asset.id}`}>
                    <Button size="sm" variant="ghost" className="neon-border">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
              <CardFooter className="p-3 md:p-4 pt-0">
                <Button 
                  className="w-full neon-border bg-primary/10 hover:bg-primary/20" 
                  size="sm"
                  onClick={() => addToCart(asset)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredAssets.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-base md:text-lg">No assets found matching your filters.</p>
            <Button
              variant="outline"
              className="mt-4 neon-border"
              onClick={() => {
                setSearchTerm("")
                setSelectedType("all")
                setSelectedRarity("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}