"use client"

import { useState } from 'react'
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
import { Wallet } from 'lucide-react'
import { toast } from 'sonner'

export default function WalletConnectDialog({ open, onOpenChange }) {
  const [walletAddress, setWalletAddress] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    if (!walletAddress) {
      toast.error('Please enter a wallet address')
      return
    }

    // Validate wallet address format (basic check)
    if (walletAddress.length < 20) {
      toast.error('Invalid wallet address')
      return
    }

    setIsConnecting(true)
    
    // Simulate connection
    setTimeout(() => {
      localStorage.setItem('wallet_address', walletAddress)
      toast.success('Wallet connected successfully!')
      onOpenChange(false)
      setIsConnecting(false)
      setWalletAddress('')
    }, 1500)
  }

  const handleMetaMask = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        setIsConnecting(true)
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        })
        
        if (accounts[0]) {
          localStorage.setItem('wallet_address', accounts[0])
          toast.success('MetaMask connected successfully!')
          onOpenChange(false)
        }
      } catch (error) {
        toast.error('Failed to connect MetaMask')
        console.error(error)
      } finally {
        setIsConnecting(false)
      }
    } else {
      toast.error('MetaMask not installed')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass-effect border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-2xl" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            Connect Your Wallet
          </DialogTitle>
          <DialogDescription>
            Enter your wallet address to connect to Tavarn.AI marketplace
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="wallet">Wallet Address</Label>
            <Input
              id="wallet"
              placeholder="0x..."
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="neon-border"
            />
          </div>
          
          <Button 
            onClick={handleConnect} 
            className="w-full neon-border bg-primary hover:bg-primary/90"
            disabled={isConnecting}
          >
            <Wallet className="mr-2 h-4 w-4" />
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or connect with
              </span>
            </div>
          </div>

          <Button 
            onClick={handleMetaMask}
            variant="outline" 
            className="w-full neon-border"
            disabled={isConnecting}
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.5 12c0 5.25-4.25 9.5-9.5 9.5S2.5 17.25 2.5 12 6.75 2.5 12 2.5s9.5 4.25 9.5 9.5z"/>
            </svg>
            MetaMask
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}