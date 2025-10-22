"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ShoppingBag, User, Wallet, Menu, X, Home } from 'lucide-react'
import WalletConnectDialog from './WalletConnectDialog'
import ProfileDialog from './ProfileDialog'
import CartDrawer from './CartDrawer'

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [walletDialogOpen, setWalletDialogOpen] = useState(false)
  const [profileDialogOpen, setProfileDialogOpen] = useState(false)
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')

  useEffect(() => {
    // Check cart count
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCartCount(cart.length)

    // Check wallet connection
    const wallet = localStorage.getItem('wallet_address')
    setWalletConnected(!!wallet)
    setWalletAddress(wallet || '')

    // Listen for storage changes
    const handleStorage = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      setCartCount(cart.length)
      const wallet = localStorage.getItem('wallet_address')
      setWalletConnected(!!wallet)
      setWalletAddress(wallet || '')
    }

    // Listen for wallet updates
    const handleWalletUpdate = () => {
      const wallet = localStorage.getItem('wallet_address')
      setWalletConnected(!!wallet)
      setWalletAddress(wallet || '')
    }

    window.addEventListener('storage', handleStorage)
    // Custom event for same-tab updates
    window.addEventListener('cartUpdated', handleStorage)
    window.addEventListener('walletUpdated', handleWalletUpdate)

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('cartUpdated', handleStorage)
      window.removeEventListener('walletUpdated', handleWalletUpdate)
    }
  }, [])

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-primary/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/tavarnai-logo.png"
              alt="Tavarn.AI Logo"
              width={200}
              height={64}
              className="w-24 h-9 sm:w-32 sm:h-12 md:w-40 md:h-14 lg:w-48 lg:h-16 xl:w-56 xl:h-18"
            />
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link href="/marketplace" className="hover:text-primary transition-colors text-sm lg:text-base">
              Marketplace
            </Link>
            <Link href="/blacklist" className="hover:text-primary transition-colors text-sm lg:text-base">
              Blacklist
            </Link>
            <Link href="/dashboard" className="hover:text-primary transition-colors text-sm lg:text-base">
              Dashboard
            </Link>
            <Link href="/docs" className="hover:text-primary transition-colors text-sm lg:text-base">
              Docs
            </Link>
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            <Button
              variant="ghost"
              size="icon"
              asChild
            >
              <Link href="/">
                <Home className="h-5 w-5" />
              </Link>
            </Button>
            {walletConnected && walletAddress && (
              <div className="flex items-center space-x-2 px-3 py-1 glass-effect rounded-lg border border-primary/30">
                <Wallet className="h-4 w-4 text-primary" />
                <span className="text-sm font-mono text-primary">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setCartDrawerOpen(true)}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Button>
            <Button
              variant="outline"
              className="neon-border text-sm lg:text-base"
              onClick={() => setWalletDialogOpen(true)}
            >
              <Wallet className="h-4 w-4 mr-2" />
              {walletConnected ? 'Connected' : 'Connect Wallet'}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setProfileDialogOpen(true)}
            >
              <User className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              asChild
            >
              <Link href="/">
                <Home className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setCartDrawerOpen(true)}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setProfileDialogOpen(true)}
            >
              <User className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-effect border-t border-primary/20">
            <div className="container mx-auto px-4 py-4 space-y-3">
              <Link 
                href="/marketplace" 
                className="block py-2 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Marketplace
              </Link>
              <Link 
                href="/blacklist" 
                className="block py-2 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blacklist
              </Link>
              <Link 
                href="/dashboard" 
                className="block py-2 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                href="/docs" 
                className="block py-2 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Docs
              </Link>
              <Button 
                variant="outline" 
                className="w-full neon-border mt-2"
                onClick={() => {
                  setWalletDialogOpen(true)
                  setMobileMenuOpen(false)
                }}
              >
                <Wallet className="h-4 w-4 mr-2" />
                {walletConnected ? 'Connected' : 'Connect Wallet'}
              </Button>
            </div>
          </div>
        )}
      </nav>

      <WalletConnectDialog open={walletDialogOpen} onOpenChange={setWalletDialogOpen} />
      <ProfileDialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen} />
      <CartDrawer open={cartDrawerOpen} onOpenChange={setCartDrawerOpen} />
    </>
  )
}