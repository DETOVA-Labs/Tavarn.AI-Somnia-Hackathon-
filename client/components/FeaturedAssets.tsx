"use client"

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Flame, ShoppingCart, Eye } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const featuredAssets = [
  {
    id: 1,
    name: "Cyber Katana X-7",
    type: "Weapon",
    price: "2.5 STT",
    image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800&h=600&fit=crop",
    rarity: "Legendary",
    game: "CyberStrike",
  },
  {
    id: 2,
    name: "Neon Dragon Skin",
    type: "Skin",
    price: "1.8 STT",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop",
    rarity: "Epic",
    game: "DragonVerse",
  },
  {
    id: 3,
    name: "Quantum Armor Set",
    type: "Armor",
    price: "3.2 STT",
    image: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=800&h=600&fit=crop",
    rarity: "Legendary",
    game: "QuantumWarriors",
  },
  {
    id: 4,
    name: "Plasma Blaster Pro",
    type: "Weapon",
    price: "1.5 STT",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop",
    rarity: "Rare",
    game: "SpaceRaiders",
  },
  {
    id: 5,
    name: "Holographic Phoenix",
    type: "NFT",
    price: "4.0 STT",
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&h=600&fit=crop",
    rarity: "Mythic",
    game: "MetaRealms",
  },
  {
    id: 6,
    name: "Stealth Assassin Gear",
    type: "Outfit",
    price: "2.0 STT",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&h=600&fit=crop",
    rarity: "Epic",
    game: "ShadowOps",
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

export default function FeaturedAssets() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 glass-effect px-4 py-2 rounded-full border border-primary/30">
            <Flame className="h-4 w-4 text-primary" />
            <span className="text-sm">Hot Deals</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            Featured <span className="text-primary">Assets</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Discover the most sought-after gaming assets from top-tier games
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredAssets.map((asset) => (
            <Link href={`/asset/${asset.id}`} key={asset.id}>
              <Card className="group glass-effect hover:neon-border transition-all duration-300 overflow-hidden cursor-pointer">
                <CardHeader className="p-0 relative overflow-hidden">
                  <div className="relative h-64 w-full">
                    <Image
                      src={asset.image}
                      alt={asset.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent"></div>
                    <Badge className={`absolute top-4 right-4 ${getRarityColor(asset.rarity)} border-none`}>
                      {asset.rarity}
                    </Badge>
                    <Badge variant="secondary" className="absolute top-4 left-4">
                      {asset.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-1 truncate" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                      {asset.name}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">{asset.game}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs md:text-sm text-muted-foreground">Current Price</div>
                      <div className="text-xl md:text-2xl font-bold text-primary" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                        {asset.price}
                      </div>
                    </div>
                    <Button size="sm" className="neon-border">
                      <Eye className="h-4 w-4 mr-1 md:mr-2" />
                      <span className="hidden sm:inline">View</span>
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button className="w-full neon-border bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Quick Buy
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link href="/marketplace">
            <Button size="lg" variant="outline" className="neon-border font-semibold">
              View All Assets
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}