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