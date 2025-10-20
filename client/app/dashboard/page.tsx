"use client"

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import BubbleAnimation from '@/components/BubbleAnimation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { 
  Wallet, 
  ShoppingBag, 
  TrendingUp, 
  DollarSign, 
  Eye,
  Edit,
  Trash2,
  Share2,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Sparkles,
  Zap
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'

const userAssets = [
  {
    id: 1,
    name: "Cyber Katana X-7",
    type: "Weapon",
    price: "2.5 STT",
    image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800&h=600&fit=crop",
    rarity: "Legendary",
    game: "CyberStrike",
    status: "Listed",
  },
  {
    id: 3,
    name: "Quantum Armor Set",
    type: "Armor",
    price: "3.2 STT",
    image: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=800&h=600&fit=crop",
    rarity: "Legendary",
    game: "QuantumWarriors",
    status: "Owned",
  },
  {
    id: 7,
    name: "Lightning Strike Bow",
    type: "Weapon",
    price: "1.2 STT",
    image: "https://images.unsplash.com/photo-1509396591411-549f5662ff5b?w=800&h=600&fit=crop",
    rarity: "Rare",
    game: "ArcherLegends",
    status: "Owned",
  },
]

const salesHistory = [
  {
    id: 1,
    asset: "Neon Dragon Skin",
    type: "Sold",
    price: "1.8 STT",
    buyer: "Player_789",
    date: "2 days ago",
    status: "Completed",
  },
  {
    id: 2,
    asset: "Cyber Katana X-7",
    type: "Bought",
    price: "2.2 STT",
    seller: "Player123",
    date: "5 days ago",
    status: "Completed",
  },
  {
    id: 3,
    asset: "Plasma Blaster Pro",
    type: "Sold",
    price: "1.5 STT",
    buyer: "GamerX",
    date: "1 week ago",
    status: "Completed",
  },
  {
    id: 4,
    asset: "Quantum Armor Set",
    type: "Bought",
    price: "3.0 STT",
    seller: "ArmorKing",
    date: "2 weeks ago",
    status: "Completed",
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

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [aiAutoPricing, setAiAutoPricing] = useState(true)
  const [walletSafetyScore] = useState(94) // This would come from API

  const handleAutoPricingToggle = (enabled: boolean) => {
    setAiAutoPricing(enabled)
    if (enabled) {
      toast.success('AI Auto-Pricing enabled', {
        description: 'Your assets will now be priced automatically based on market demand',
      })
    } else {
      toast.info('AI Auto-Pricing disabled', {
        description: 'You will need to manually set prices for your assets',
      })
    }
  }

  const getSafetyColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div className="dark min-h-screen cyber-grid relative">
      <BubbleAnimation />
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Profile Header */}
        <div className="glass-effect rounded-lg p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px]"></div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center space-x-6">
              <Avatar className="h-24 w-24 border-4 border-primary neon-border">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=cyberninja" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  CyberNinja_99
                </h1>
                <p className="text-muted-foreground mb-3">Joined 3 months ago</p>
                <div className="flex gap-2">
                  <Badge variant="secondary">Level 45</Badge>
                  <Badge className="bg-primary/20 text-primary border-primary/30">Verified Seller</Badge>
                  <Badge className={`${getSafetyColor(walletSafetyScore)} bg-green-500/10 border-green-500/30`}>
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    Safety Score: {walletSafetyScore}%
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" className="neon-border">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline" className="neon-border">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* AI Auto-Pricing Toggle */}
          <div className="mt-6 p-4 glass-effect rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <Label htmlFor="auto-pricing" className="text-base font-semibold cursor-pointer">
                  AI Auto-Pricing Mode
                </Label>
                <p className="text-sm text-muted-foreground">
                  Let AI automatically adjust prices based on market demand
                </p>
              </div>
            </div>
            <Switch 
              id="auto-pricing"
              checked={aiAutoPricing}
              onCheckedChange={handleAutoPricingToggle}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-effect neon-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <Badge variant="secondary" className="text-xs">+12.5%</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Wallet Balance</p>
                <p className="text-3xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  8.5 STT
                </p>
                <p className="text-sm text-muted-foreground">≈ $14,450</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect neon-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-secondary" />
                </div>
                <Badge variant="secondary" className="text-xs">3 Listed</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Assets</p>
                <p className="text-3xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  {userAssets.length}
                </p>
                <p className="text-sm text-muted-foreground">Worth 7.9 STT</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect neon-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +8.2%
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="text-3xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  24
                </p>
                <p className="text-sm text-muted-foreground">18.3 STT Volume</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect neon-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-secondary" />
                </div>
                <Badge variant="secondary" className="text-xs">This Month</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Profit</p>
                <p className="text-3xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  +3.2 STT
                </p>
                <p className="text-sm text-muted-foreground">≈ $5,440</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Card className="glass-effect">
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 glass-effect">
                <TabsTrigger value="overview">My Assets</TabsTrigger>
                <TabsTrigger value="history">Sales History</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="pt-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                      Your Collection
                    </h3>
                    <p className="text-sm text-muted-foreground">Manage your gaming assets</p>
                  </div>
                  <Button className="neon-border bg-primary/10 hover:bg-primary/20">
                    <Plus className="h-4 w-4 mr-2" />
                    List New Asset
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userAssets.map((asset) => (
                    <Card key={asset.id} className="glass-effect hover:neon-border transition-all duration-300 overflow-hidden group">
                      <CardHeader className="p-0 relative">
                        <div className="relative h-56 w-full">
                          <Image
                            src={asset.image}
                            alt={asset.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent"></div>
                          <Badge className={`absolute top-3 right-3 ${getRarityColor(asset.rarity)} border-none`}>
                            {asset.rarity}
                          </Badge>
                          <Badge 
                            variant={asset.status === "Listed" ? "default" : "secondary"} 
                            className="absolute top-3 left-3"
                          >
                            {asset.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 space-y-4">
                        <div>
                          <h3 className="text-lg font-bold mb-1" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                            {asset.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">{asset.game}</p>
                        </div>
                        
                        {asset.status === "Listed" && (
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Listed Price</div>
                            <div className="text-xl font-bold text-primary" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                              {asset.price}
                            </div>
                          </div>
                        )}

                        <Separator />

                        <div className="flex gap-2">
                          <Link href={`/asset/${asset.id}`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full neon-border">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </Link>
                          {asset.status === "Owned" ? (
                            <Button size="sm" className="flex-1 neon-border bg-primary/10 hover:bg-primary/20">
                              List for Sale
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" className="neon-border">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="history" className="pt-6">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                    Transaction History
                  </h3>
                  <p className="text-sm text-muted-foreground">Your buying and selling activity</p>
                </div>

                <div className="space-y-4">
                  {salesHistory.map((transaction) => (
                    <div key={transaction.id} className="glass-effect p-4 rounded-lg flex items-center justify-between hover:neon-border transition-all">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          transaction.type === "Sold" ? "bg-primary/20" : "bg-secondary/20"
                        }`}>
                          {transaction.type === "Sold" ? (
                            <ArrowUpRight className="h-6 w-6 text-primary" />
                          ) : (
                            <ArrowDownRight className="h-6 w-6 text-secondary" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-lg">{transaction.asset}</div>
                          <div className="text-sm text-muted-foreground">
                            {transaction.type === "Sold" 
                              ? `Sold to ${transaction.buyer}` 
                              : `Bought from ${transaction.seller}`
                            }
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xl font-bold ${
                          transaction.type === "Sold" ? "text-primary" : "text-secondary"
                        }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                          {transaction.type === "Sold" ? "+" : "-"}{transaction.price}
                        </div>
                        <div className="text-sm text-muted-foreground">{transaction.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="activity" className="pt-6">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                    Recent Activity
                  </h3>
                  <p className="text-sm text-muted-foreground">Track all your marketplace interactions</p>
                </div>

                <div className="space-y-4">
                  <div className="glass-effect p-4 rounded-lg flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">Listed Cyber Katana X-7</div>
                      <div className="text-sm text-muted-foreground">Listed for 2.5 STT</div>
                      <div className="text-xs text-muted-foreground mt-1">2 hours ago</div>
                    </div>
                  </div>

                  <div className="glass-effect p-4 rounded-lg flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="h-5 w-5 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">Sale Completed</div>
                      <div className="text-sm text-muted-foreground">Neon Dragon Skin sold for 1.8 STT</div>
                      <div className="text-xs text-muted-foreground mt-1">2 days ago</div>
                    </div>
                  </div>

                  <div className="glass-effect p-4 rounded-lg flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Eye className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">Asset Viewed</div>
                      <div className="text-sm text-muted-foreground">Your Quantum Armor Set has 24 new views</div>
                      <div className="text-xs text-muted-foreground mt-1">3 days ago</div>
                    </div>
                  </div>

                  <div className="glass-effect p-4 rounded-lg flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="h-5 w-5 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">Purchase Completed</div>
                      <div className="text-sm text-muted-foreground">Bought Lightning Strike Bow for 1.2 STT</div>
                      <div className="text-xs text-muted-foreground mt-1">5 days ago</div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}