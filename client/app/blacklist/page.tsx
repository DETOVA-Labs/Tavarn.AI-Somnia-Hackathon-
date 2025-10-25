"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { ShieldAlert, AlertTriangle, CheckCircle2, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { Skeleton } from "@/components/ui/skeleton"
import { BlacklistedUser } from '@/lib/types'
import { getBlacklist, getBlacklistStats, submitBlacklistReport } from '@/lib/blacklist'

const formatTimestamp = (timestamp: any) => {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp._seconds * 1000);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

export default function BlacklistPage() {
  const [formData, setFormData] = useState({
    address: '',
    reason: '',
    evidence: ''
  })
  const [blacklist, setBlacklist] = useState<BlacklistedUser[]>([])
  const [stats, setStats] = useState({ scamsBlocked: 0, reportsThisMonth: 0, assetsProtected: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blacklistData, statsData] = await Promise.all([
          getBlacklist(),
          getBlacklistStats()
        ]);

        setBlacklist(blacklistData);
        setStats(statsData);
      } catch (err:any) {
          setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.address || !formData.reason) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      await submitBlacklistReport(formData);
      toast.success('Report submitted successfully! Our AI will verify this report.')
      
      setFormData({
        address: '',
        reason: '',
        evidence: ''
      })
    } catch (error:any) {
      toast.error(error.message || 'An unexpected error occurred.');
    }
  }

  return (
    <div className="dark min-h-screen cyber-grid relative">
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

                <Button type="submit" className="w-full neon-border bg-primary hover:bg-primary/20">
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
                      {loading ? <Skeleton className="h-8 w-24" /> : stats.scamsBlocked}
                    </div>
                  </div>
                  <ShieldAlert className="h-8 w-8 text-primary" />
                </div>

                <div className="flex items-center justify-between p-4 glass-effect rounded-lg">
                  <div>
                    <div className="text-sm text-muted-foreground">Reports This Month</div>
                    <div className="text-2xl font-bold text-secondary" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                      {loading ? <Skeleton className="h-8 w-16" /> : stats.reportsThisMonth}
                    </div>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-secondary" />
                </div>

                <div className="flex items-center justify-between p-4 glass-effect rounded-lg">
                  <div>
                    <div className="text-sm text-muted-foreground">Assets Protected</div>
                    <div className="text-2xl font-bold text-primary" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                      {loading ? <Skeleton className="h-8 w-20" /> : stats.assetsProtected}
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

        <Card className="glass-effect w-fit">
          <CardHeader>
            <CardTitle className="text-2xl" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              Verified Scam Addresses
            </CardTitle>
            <CardDescription>
              Community-reported addresses that have been verified by our AI and moderation team
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="glass-effect p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                    <Skeleton className="h-4 w-full mt-2" />
                    <Skeleton className="h-4 w-3/4 mt-1" />
                    <div className="flex items-center gap-4 mt-3">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <p className="text-destructive">Error: {error}</p>
            ) : (
              <div className="space-y-4 w-fit">
                {blacklist.map((user) => (
                  <div 
                    key={user.id} 
                    className="glass-effect p-4 rounded-lg hover:neon-border transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                          <code className="px-3 py-1 bg-muted rounded  text-sm font-mono">
                            {user.address}
                          </code>
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Verified
                          </Badge>
                          <Badge variant="secondary">
                            {user.reports} reports
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          {user.blacklist_reason}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Reported: {formatTimestamp(user.created_at)}</span>
                            {user.link_to_evidence && (
                            <a href={user.link_to_evidence} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                                View Evidence
                                <ExternalLink className="ml-1 h-3 w-3 inline" />
                            </a>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}