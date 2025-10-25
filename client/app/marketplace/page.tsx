"use client"
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search,Eye } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useAssets } from '@/hooks/useAssets'

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedRarity, setSelectedRarity] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const { assets, isLoading } = useAssets()

  return (
    <div className="dark min-h-screen cyber-grid relative">
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
              </SelectContent>
            </Select>
            
            <Select value={selectedRarity} onValueChange={setSelectedRarity}>
              <SelectTrigger className="neon-border">
                <SelectValue placeholder="Rarity" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="all">All</SelectItem>

              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="neon-border">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {isLoading ? (
            <p>Loading assets...</p>
          ) : ( assets &&
            assets.map((asset) => (
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
                    </div>
                  </Link>
                </CardHeader>
                <CardContent className="p-3 md:p-4 space-y-3 flex-grow">
                  <Link href={`/asset/${asset.id}`}>
                    <div>
                      <h3 className="text-base md:text-lg font-bold mb-1" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                        {asset.name}
                      </h3>
                    </div>
                  </Link>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground">Price</div>
                      <div className="text-lg md:text-xl font-bold text-primary" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                        {asset.price}
                      </div>
                      <div className="text-xs text-muted-foreground">Listings: {asset.inventory}</div>
                    </div>
                    <Link href={`/asset/${asset.id}`}>
                      <Button size="sm" variant="ghost" className="neon-border">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
       </Card>
            ))
          )}
        </div>

        {!assets.length && !isLoading && (
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