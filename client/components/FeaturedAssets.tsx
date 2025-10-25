"use client"

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Flame, ShoppingCart, Eye } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useAssets } from '@/hooks/useAssets'
import { useBuyItem } from '@/hooks/useBuyItem';

export default function FeaturedAssets() {
    const { assets } = useAssets();
    const { buyItem, isPending } = useBuyItem();

    const handleQuickBuy = (e: React.MouseEvent, assetId: string) => {
        e.preventDefault();
        e.stopPropagation();
        buyItem({ item: assetId as `0x${string}`, qty: 1 });
    };

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
          {assets.map((asset) => (
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
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-1 truncate" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                      {asset.name}
                    </h3>
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
                  <Button 
                    className="w-full neon-border bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                    onClick={(e) => handleQuickBuy(e, asset.id)}
                    disabled={isPending}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {isPending ? 'Buying...' : 'Quick Buy'}
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