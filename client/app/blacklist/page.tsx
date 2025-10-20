"use client"

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import BubbleAnimation from '@/components/BubbleAnimation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { ShieldAlert, AlertTriangle, CheckCircle2, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

const verifiedScams = [
  {
    id: 1,
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    reason: "Fake NFT minting - multiple reports of stolen assets",
    reports: 47,
    verified: true,
    date: "2024-01-15"
  },
  {
    id: 2,
    address: "0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e",
    reason: "Phishing attack - impersonating official marketplace",
    reports: 89,
    verified: true,
    date: "2024-01-10"
  },
  {
    id: 3,
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    reason: "Price manipulation - coordinated pump and dump",
    reports: 23,
    verified: true,
    date: "2024-01-08"
  },
  {
    id: 4,
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    reason: "Fake asset duplication - selling non-existent items",
    reports: 156,
    verified: true,
    date: "2024-01-05"
  },
]

export default function BlacklistPage() {
  const [formData, setFormData] = useState({
    address: '',
    reason: '',
    evidence: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.address || !formData.reason) {
      toast.error('Please fill in all required fields')
      return
    }

    // TODO: Submit to backend API
    toast.success('Report submitted successfully! Our AI will verify this report.')
    
    setFormData({
      address: '',
      reason: '',
      evidence: ''
    })
  }

  return (
    <div className="dark min-h-screen cyber-grid relative">
      <BubbleAnimation />
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-effect border border-destructive/30 mb-4">
            <ShieldAlert className="h-4 w-4 text-destructive" />
            <span className="text-sm">Community Protection System</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            Tavarn Guard
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Protecting Players — Report scam wallets or fake items here
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Report Form */}
          <Card className="glass-effect neon-border">
            <CardHeader>
              <CardTitle className="text-2xl" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                Report Suspicious Activity
              </CardTitle>
              <CardDescription>
                Help us keep the marketplace safe by reporting scammers and fraudulent activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="address">Wallet Address *</Label>
                  <Input
                    id="address"
                    placeholder="0x..."
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="glass-effect"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the wallet address or item contract address
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Report *</Label>
                  <Textarea
                    id="reason"
                    placeholder="Describe the suspicious activity..."
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    className="glass-effect min-h-[100px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="evidence">Evidence Link (Optional)</Label>
                  <Input
                    id="evidence"
                    placeholder="https://..."
                    value={formData.evidence}
                    onChange={(e) => setFormData({ ...formData, evidence: e.target.value })}
                    className="glass-effect"
                  />
                  <p className="text-xs text-muted-foreground">
                    Screenshots, transaction hashes, or other proof
                  </p>
                </div>

                <Button type="submit" className="w-full neon-border bg-primary/10 hover:bg-primary/20">
                  <ShieldAlert className="mr-2 h-4 w-4" />
                  Submit Report
                </Button>

                <div className="glass-effect p-4 rounded-lg space-y-2">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-muted-foreground">
                      All reports are reviewed by our AI verification system and community moderators. 
                      False reports may result in account restrictions.
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <div className="space-y-6">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  Protection Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 glass-effect rounded-lg">
                  <div>
                    <div className="text-sm text-muted-foreground">Scams Blocked</div>
                    <div className="text-2xl font-bold text-primary" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                      1,247
                    </div>
                  </div>
                  <ShieldAlert className="h-8 w-8 text-primary" />
                </div>

                <div className="flex items-center justify-between p-4 glass-effect rounded-lg">
                  <div>
                    <div className="text-sm text-muted-foreground">Reports This Month</div>
                    <div className="text-2xl font-bold text-secondary" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                      89
                    </div>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-secondary" />
                </div>

                <div className="flex items-center justify-between p-4 glass-effect rounded-lg">
                  <div>
                    <div className="text-sm text-muted-foreground">Assets Protected</div>
                    <div className="text-2xl font-bold text-primary" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                      $2.8M
                    </div>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-destructive/30">
              <CardHeader>
                <CardTitle className="text-destructive" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  Common Scam Types
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="glass-effect p-3 rounded-lg">
                  <div className="font-semibold text-sm">Fake NFT Minting</div>
                  <div className="text-xs text-muted-foreground">Unauthorized copies of legitimate assets</div>
                </div>
                <div className="glass-effect p-3 rounded-lg">
                  <div className="font-semibold text-sm">Phishing Links</div>
                  <div className="text-xs text-muted-foreground">Fake websites impersonating Tavarn.AI</div>
                </div>
                <div className="glass-effect p-3 rounded-lg">
                  <div className="font-semibold text-sm">Price Manipulation</div>
                  <div className="text-xs text-muted-foreground">Coordinated pump and dump schemes</div>
                </div>
                <div className="glass-effect p-3 rounded-lg">
                  <div className="font-semibold text-sm">Fake Support</div>
                  <div className="text-xs text-muted-foreground">Impersonating official support channels</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Verified Scams List */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="text-2xl" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              Verified Scam Addresses
            </CardTitle>
            <CardDescription>
              Community-reported addresses that have been verified by our AI and moderation team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {verifiedScams.map((scam) => (
                <div 
                  key={scam.id} 
                  className="glass-effect p-4 rounded-lg hover:neon-border transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <code className="px-3 py-1 bg-muted rounded text-sm font-mono">
                          {scam.address}
                        </code>
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Verified
                        </Badge>
                        <Badge variant="secondary">
                          {scam.reports} reports
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {scam.reason}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Reported: {scam.date}</span>
                        <Button variant="ghost" size="sm" className="h-auto p-0 text-primary hover:text-primary/80">
                          View Details
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}