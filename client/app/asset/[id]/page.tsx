"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ShoppingCart, Heart, Share2, TrendingUp, Shield, Zap, Eye, Clock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import {useAccount} from "wagmi";
import { assetDetails, getRarityColor } from "@/lib/dummy-data";
import { DemoAlert } from "@/components/ui/demo-alert";

export default function AssetDetailPage({ params }: { params: { id: string } }) {
  const [isLiked, setIsLiked] = useState(false)
  const [walletDialogOpen, setWalletDialogOpen] = useState(false)
  const [offerDialogOpen, setOfferDialogOpen] = useState(false)
  const [offerAmount, setOfferAmount] = useState('')
  const asset = assetDetails[1]
const  {address,isConnected} = useAccount()
  const handleBuyNow = () => {

    if (!address) {
      toast.error('Please connect your wallet first')
      setWalletDialogOpen(true)
      return
    }
  }

  const handleMakeOffer = () => {

    if (!address) {
      toast.error('Please connect your wallet first')
      setWalletDialogOpen(true)
      return
    }

    setOfferDialogOpen(true)
  }

  const submitOffer = () => {
    if (!offerAmount || parseFloat(offerAmount) <= 0) {
      toast.error('Please enter a valid offer amount')
      return
    }

    toast.success(`Offer of ${offerAmount} STT submitted!`)
    setOfferDialogOpen(false)
    setOfferAmount('')
  }

  if (!asset) {
    return <div className="dark min-h-screen flex items-center justify-center">Asset not found</div>
  }

  return (
    <div className="dark min-h-screen cyber-grid relative">
      <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <DemoAlert />
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/marketplace" className="hover:text-primary">Marketplace</Link>
          <span>/</span>
          <span className="text-foreground">{asset.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-12">
          {/* Image Section */}
          <div className="space-y-4">
            <Card className="glass-effect overflow-hidden neon-border">
              <CardContent className="p-0">
                <div className="relative h-[400px] md:h-[500px] w-full group">
                  <Image
                    src={asset.image}
                    alt={asset.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
                  <Badge className={`absolute top-4 right-4 ${getRarityColor(asset.rarity)} border-none text-base md:text-lg px-3 md:px-4 py-1 md:py-2`}>
                    {asset.rarity}
                  </Badge>
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <Button size="icon" variant="secondary" className="glass-effect">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Additional stats */}
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              <Card className="glass-effect">
                <CardContent className="p-3 md:p-4 text-center">
                  <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-primary mx-auto mb-2" />
                  <div className="text-xs md:text-sm text-muted-foreground">Floor Price</div>
                  <div className="text-base md:text-lg font-bold">2.1 STT</div>
                </CardContent>
              </Card>
              <Card className="glass-effect">
                <CardContent className="p-3 md:p-4 text-center">
                  <Clock className="h-5 w-5 md:h-6 md:w-6 text-secondary mx-auto mb-2" />
                  <div className="text-xs md:text-sm text-muted-foreground">Listed</div>
                  <div className="text-base md:text-lg font-bold">2h ago</div>
                </CardContent>
              </Card>
              <Card className="glass-effect">
                <CardContent className="p-3 md:p-4 text-center">
                  <Eye className="h-5 w-5 md:h-6 md:w-6 text-primary mx-auto mb-2" />
                  <div className="text-xs md:text-sm text-muted-foreground">Views</div>
                  <div className="text-base md:text-lg font-bold">1.2k</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <Badge variant="secondary" className="mb-2">{asset.type}</Badge>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    {asset.name}
                  </h1>
                  <p className="text-muted-foreground">from {asset.game}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="neon-border"
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button size="icon" variant="outline" className="neon-border">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{asset.description}</p>
            </div>

            {/* Owner/Creator Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="glass-effect">
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground mb-2">Current Owner</div>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={asset.owner.avatar} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-1 min-w-0">
                      <span className="font-semibold text-sm truncate">{asset.owner.name}</span>
                      {asset.owner.verified && (
                        <Shield className="h-3 w-3 text-primary flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-effect">
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground mb-2">Creator</div>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={asset.creator.avatar} />
                      <AvatarFallback>CF</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-1 min-w-0">
                      <span className="font-semibold text-sm truncate">{asset.creator.name}</span>
                      {asset.creator.verified && (
                        <Shield className="h-3 w-3 text-primary flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Price Card with AI animation */}
            <Card className="glass-effect neon-border">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Current Price (AI Adjusted)</div>
                    <div className="text-3xl md:text-4xl font-bold text-primary animate-pulse" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                      {asset.price}
                    </div>
                    <div className="text-sm text-muted-foreground">{asset.priceUsd}</div>
                  </div>
                  <Zap className="h-10 w-10 md:h-12 md:w-12 text-primary animate-pulse" />
                </div>
                
                <Separator className="my-4" />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <Button 
                    size="lg" 
                    className="neon-border bg-primary hover:bg-primary/90 w-full"
                    onClick={handleBuyNow}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Buy Now
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="neon-border w-full"
                    onClick={handleMakeOffer}
                  >
                    Make Offer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs Section */}
        <Card className="glass-effect">
          <CardHeader>
            <Tabs defaultValue="stats" className="w-full">
              <TabsList className="grid w-full grid-cols-3 glass-effect">
                <TabsTrigger value="stats" className="text-xs md:text-sm">Stats & Attributes</TabsTrigger>
                <TabsTrigger value="history" className="text-xs md:text-sm">Transaction History</TabsTrigger>
                <TabsTrigger value="details" className="text-xs md:text-sm">Details</TabsTrigger>
              </TabsList>
              
              <TabsContent value="stats" className="space-y-6 pt-6">
                <div>
                  <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    Combat Stats
                  </h3>
                  <div className="space-y-4">
                    {asset.stats.map((stat) => (
                      <div key={stat.name}>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">{stat.name}</span>
                          <span className="text-sm text-primary">{stat.value}/{stat.max}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all"
                            style={{ width: `${(stat.value / stat.max) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    Attributes
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {asset.attributes.map((attr) => (
                      <div key={attr.trait} className="glass-effect p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">{attr.trait}</div>
                        <div className="font-semibold text-primary">{attr.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="pt-6">
                <div className="space-y-4">
                  {asset.history.map((event, idx) => (
                    <div key={idx} className="glass-effect p-4 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full ${getRarityColor(asset.rarity)} flex items-center justify-center flex-shrink-0`}>
                          {event.event === "Listed" && <ShoppingCart className="h-5 w-5" />}
                          {event.event === "Sale" && <TrendingUp className="h-5 w-5" />}
                          {event.event === "Minted" && <Zap className="h-5 w-5" />}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold">{event.event}</div>
                          <div className="text-sm text-muted-foreground">
                            {event.from && `From ${event.from}`}
                            {event.to && ` to ${event.to}`}
                          </div>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <div className="font-bold text-primary">{event.price}</div>
                        <div className="text-sm text-muted-foreground">{event.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="glass-effect p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Contract Address</div>
                      <div className="font-mono text-xs md:text-sm text-primary break-all">0x742d...4f8a</div>
                    </div>
                    <div className="glass-effect p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Token ID</div>
                      <div className="font-mono text-sm text-primary">#1337</div>
                    </div>
                    <div className="glass-effect p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Blockchain</div>
                      <div className="font-semibold">Somnia</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="glass-effect p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Token Standard</div>
                      <div className="font-semibold">ERC-721</div>
                    </div>
                    <div className="glass-effect p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Royalty Fee</div>
                      <div className="font-semibold">5%</div>
                    </div>
                    <div className="glass-effect p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Metadata</div>
                      <div className="font-semibold text-primary">IPFS</div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>
      </div>
      <Dialog open={offerDialogOpen} onOpenChange={setOfferDialogOpen}>
        <DialogContent className="sm:max-w-md glass-effect border-primary/20">
          <DialogHeader>
            <DialogTitle className="text-2xl" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              Make an Offer
            </DialogTitle>
            <DialogDescription>
              Submit your offer for {asset.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="glass-effect p-4 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Current Price</div>
              <div className="text-2xl font-bold text-primary">{asset.price}</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="offer">Your Offer (STT)</Label>
              <Input
                id="offer"
                type="number"
                step="0.1"
                placeholder="Enter amount in STT"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                className="neon-border"
              />
            </div>
            
            <Button 
              onClick={submitOffer} 
              className="w-full neon-border bg-primary hover:bg-primary/90"
            >
              Submit Offer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}