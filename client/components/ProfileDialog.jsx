"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Mail, Lock } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function ProfileDialog({ open, onOpenChange }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user')
    setIsLoggedIn(!!user)
  }, [open])

  const handleSubmit = async () => {
    if (!email || !password || (!isLogin && !name)) {
      toast.error('Please fill all fields')
      return
    }

    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      if (isLogin) {
        // Login
        const user = { email, name: 'User' }
        localStorage.setItem('user', JSON.stringify(user))
        toast.success('Logged in successfully!')
      } else {
        // Register
        const user = { email, name }
        localStorage.setItem('user', JSON.stringify(user))
        toast.success('Account created successfully!')
      }
      
      onOpenChange(false)
      setIsLoading(false)
      setEmail('')
      setPassword('')
      setName('')
    }, 1500)
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('wallet_address')
    toast.success('Logged out successfully!')
    onOpenChange(false)
    setIsLoggedIn(false)
  }

  if (isLoggedIn) {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const connectedWallets = JSON.parse(localStorage.getItem('connected_wallets') || '[]')
    const currentWallet = localStorage.getItem('wallet_address')

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md glass-effect border-primary/20">
          <DialogHeader>
            <DialogTitle className="text-2xl" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              Profile
            </DialogTitle>
            <DialogDescription>
              Manage your account and settings
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="p-4 glass-effect rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold">{user.name || 'User'}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </div>
              </div>
            </div>

            {/* Connected Wallets Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                Connected Wallets
              </h3>
              {connectedWallets.length > 0 ? (
                <div className="space-y-2">
                  {connectedWallets.map((wallet, index) => (
                    <div
                      key={index}
                      className={`p-3 glass-effect rounded-lg border ${
                        wallet === currentWallet ? 'border-primary' : 'border-primary/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-sm font-mono">
                              {wallet.slice(0, 6)}...{wallet.slice(-4)}
                            </div>
                            {wallet === currentWallet && (
                              <div className="text-xs text-primary">Currently Active</div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              localStorage.setItem('wallet_address', wallet)
                              window.dispatchEvent(new Event('walletUpdated'))
                              toast.success('Switched to wallet: ' + wallet.slice(0, 6) + '...' + wallet.slice(-4))
                            }}
                            disabled={wallet === currentWallet}
                            className="text-xs"
                          >
                            {wallet === currentWallet ? 'Active' : 'Switch'}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              const newAddress = prompt('Enter new wallet address:', wallet)
                              if (newAddress && newAddress !== wallet) {
                                // Validate new address
                                if (!/^0x[a-fA-F0-9]{40}$/.test(newAddress)) {
                                  toast.error('Invalid Ethereum address format')
                                  return
                                }

                                // Update in connected wallets array
                                const updatedWallets = connectedWallets.map(w => w === wallet ? newAddress : w)
                                localStorage.setItem('connected_wallets', JSON.stringify(updatedWallets))

                                // Update current wallet if it was the one being edited
                                if (wallet === currentWallet) {
                                  localStorage.setItem('wallet_address', newAddress)
                                }

                                window.dispatchEvent(new Event('walletUpdated'))
                                toast.success('Wallet address updated successfully')
                              }
                            }}
                            className="text-xs text-muted-foreground hover:text-primary"
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 glass-effect rounded-lg border border-dashed border-primary/30 text-center">
                  <p className="text-sm text-muted-foreground">No wallets connected yet</p>
                </div>
              )}
            </div>

            <Link href="/dashboard">
              <Button className="w-full neon-border" onClick={() => onOpenChange(false)}>
                Go to Dashboard
              </Button>
            </Link>

            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full neon-border"
            >
              Logout
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass-effect border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-2xl" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            {isLogin ? 'Login' : 'Create Account'}
          </DialogTitle>
          <DialogDescription>
            {isLogin 
              ? 'Login to access your account and start trading' 
              : 'Create an account to start trading on Tavarn.AI'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 neon-border"
                />
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 neon-border"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 neon-border"
              />
            </div>
          </div>
          
          <Button 
            onClick={handleSubmit} 
            className="w-full neon-border bg-primary hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading ? 'Please wait...' : (isLogin ? 'Login' : 'Create Account')}
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline"
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}