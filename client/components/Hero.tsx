"use client"

import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import WalletConnectDialog from './WalletConnectDialog'

export default function Hero() {
  const [walletDialogOpen, setWalletDialogOpen] = useState(false)

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 md:pt-24">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-effect border border-primary/30 mb-4">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs md:text-sm">Powered by AI on Somnia Blockchain</span>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-bold mb-6" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              Welcome to{' '}
              <span className="text-primary" style={{
                textShadow: '0 0 3px var(--neon-cyan), 0 0 6px var(--neon-cyan)'
              }}>
                Tavarn.AI
              </span>
              <br />
              <span className="text-2xl md:text-5xl text-muted-foreground">
                The Smartest Trader on Somnia
              </span>
            </h1>
            
            <p className="text-base md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              An AI-powered game marketplace where prices evolve with demand.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link href="/marketplace">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto text-base md:text-lg px-8 md:px-10 py-6 md:py-7 font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                  style={{
                    background: 'linear-gradient(135deg, var(--primary) 0%, #00b8d4 100%)',
                    color: 'var(--primary-foreground)',
                    border: '2px solid var(--primary)',
                    boxShadow: '0 0 20px rgba(0, 217, 255, 0.3), inset 0 0 10px rgba(0, 217, 255, 0.1)'
                  }}
                >
                  Explore Market
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto text-base md:text-lg px-8 md:px-10 py-6 md:py-7 font-semibold shadow-lg shadow-secondary/20 hover:shadow-secondary/40 transition-all"
                onClick={() => setWalletDialogOpen(true)}
                style={{
                  background: 'rgba(168, 85, 247, 0.1)',
                  border: '2px solid var(--secondary)',
                  boxShadow: '0 0 20px rgba(168, 85, 247, 0.2), inset 0 0 10px rgba(168, 85, 247, 0.1)'
                }}
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Connect Wallet
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 pt-16 max-w-3xl mx-auto">
              <div className="glass-effect p-4 md:p-6 rounded-lg">
                <div className="text-2xl md:text-4xl font-bold text-primary" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  50K+
                </div>
                <div className="text-xs md:text-sm text-muted-foreground mt-2">Active Traders</div>
              </div>
              <div className="glass-effect p-4 md:p-6 rounded-lg">
                <div className="text-2xl md:text-4xl font-bold text-secondary" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  $2.5M
                </div>
                <div className="text-xs md:text-sm text-muted-foreground mt-2">Volume Traded</div>
              </div>
              <div className="glass-effect p-4 md:p-6 rounded-lg">
                <div className="text-2xl md:text-4xl font-bold text-primary" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  15K+
                </div>
                <div className="text-xs md:text-sm text-muted-foreground mt-2">Assets Listed</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
          <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-primary rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      <WalletConnectDialog open={walletDialogOpen} onOpenChange={setWalletDialogOpen} />
    </>
  )
}