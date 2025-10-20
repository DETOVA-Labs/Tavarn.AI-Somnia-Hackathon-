"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Wallet, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

interface WalletConnectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function WalletConnectDialog({ open, onOpenChange }: WalletConnectDialogProps) {
  const [walletAddress, setWalletAddress] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  const handleConnect = async () => {
    if (!walletAddress || walletAddress.length < 42) {
      toast.error('Please enter a valid wallet address')
      return
    }

    setIsConnecting(true)
    
    // Simulate connection
    setTimeout(() => {
      setIsConnecting(false)
      setIsConnected(true)
      localStorage.setItem('wallet_address', walletAddress)
      toast.success('Wallet connected successfully!')
      
      setTimeout(() => {
        onOpenChange(false)
        setIsConnected(false)
        setWalletAddress('')
      }, 1500)
    }, 1500)
  }

  const handleMetaMaskConnect = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        setIsConnecting(true)
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        if (accounts[0]) {
          setWalletAddress(accounts[0])
          localStorage.setItem('wallet_address', accounts[0])
          setIsConnected(true)
          toast.success('Wallet connected via MetaMask!')
          
          setTimeout(() => {
            onOpenChange(false)
            setIsConnected(false)
            setWalletAddress('')
            setIsConnecting(false)
          }, 1500)
        }
      } catch (error) {
        toast.error('Failed to connect MetaMask')
        setIsConnecting(false)
      }
    } else {
      toast.error('MetaMask is not installed')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-effect border-primary/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            <Wallet className="h-6 w-6 text-primary" />
            Connect Your Wallet
          </DialogTitle>
          <DialogDescription>
            Enter your Somnia wallet address to start trading on Tavarn.AI
          </DialogDescription>
        </DialogHeader>
        
        {!isConnected ? (
          <>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="wallet">Wallet Address</Label>
                <Input
                  id="wallet"
                  placeholder="0x..."
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="glass-effect border-primary/20"
                  disabled={isConnecting}
                />
                <p className="text-xs text-muted-foreground">
                  Your Somnia wallet address (starts with 0x)
                </p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-muted" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or connect with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full neon-border"
                onClick={handleMetaMaskConnect}
                disabled={isConnecting}
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="h-5 w-5 mr-2" />
                MetaMask
              </Button>
            </div>

            <DialogFooter>
              <Button
                type="button"
                onClick={handleConnect}
                disabled={isConnecting || !walletAddress}
                className="w-full neon-border bg-primary hover:bg-primary/90"
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse" />
            <p className="text-lg font-semibold">Wallet Connected!</p>
            <p className="text-sm text-muted-foreground mt-2">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}