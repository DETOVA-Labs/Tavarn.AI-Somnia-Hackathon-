"use client"

import { useState, useEffect } from 'react'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { X, Trash2, ShoppingCart, Wallet } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

interface CartItem {
  id: number
  name: string
  price: string
  image: string
  type: string
}

interface CartDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [walletConnected, setWalletConnected] = useState(false)

  useEffect(() => {
    if (open) {
      loadCart()
      checkWallet()
    }
  }, [open])

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCartItems(cart)
  }

  const checkWallet = () => {
    const wallet = localStorage.getItem('wallet_address')
    setWalletConnected(!!wallet)
  }

  const removeItem = (itemId: number) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId)
    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    window.dispatchEvent(new Event('cartUpdated'))
    toast.success('Item removed from cart')
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.setItem('cart', JSON.stringify([]))
    window.dispatchEvent(new Event('cartUpdated'))
    toast.success('Cart cleared')
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace(' STT', ''))
      return total + price
    }, 0).toFixed(2)
  }

  const handleCheckout = () => {
    if (!walletConnected) {
      toast.error('Please connect your wallet first')
      onOpenChange(false)
      return
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    // Demo checkout
    toast.success(`Checkout initiated for ${cartItems.length} items (${calculateTotal()} STT)!`, {
      description: 'This is a demo. In production, this would process the transaction.'
    })
    
    // Clear cart after checkout
    clearCart()
    onOpenChange(false)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="glass-effect border-primary/20">
        <DrawerHeader className="border-b border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle className="text-2xl font-bold flex items-center gap-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                <ShoppingCart className="h-6 w-6 text-primary" />
                Shopping Cart
              </DrawerTitle>
              <DrawerDescription>
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-5 w-5" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-4">Browse the marketplace and add some assets!</p>
              <DrawerClose asChild>
                <Button variant="outline" className="neon-border">
                  Continue Shopping
                </Button>
              </DrawerClose>
            </div>
          ) : (
            <>
              {cartItems.map((item) => (
                <div key={item.id} className="glass-effect p-4 rounded-lg hover:neon-border transition-all">
                  <div className="flex gap-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate mb-1">{item.name}</h4>
                      <Badge variant="secondary" className="text-xs mb-2">{item.type}</Badge>
                      <div className="text-lg font-bold text-primary" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                        {item.price}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                size="sm"
                className="w-full text-destructive border-destructive/50 hover:bg-destructive/10"
                onClick={clearCart}
              >
                Clear Cart
              </Button>
            </>
          )}
        </div>

        {cartItems.length > 0 && (
          <DrawerFooter className="border-t border-primary/20">
            <div className="space-y-4">
              <div className="glass-effect p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">{calculateTotal()} STT</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">Platform Fee (2.5%)</span>
                  <span className="font-semibold">{(parseFloat(calculateTotal()) * 0.025).toFixed(2)} STT</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold text-primary" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    {(parseFloat(calculateTotal()) * 1.025).toFixed(2)} STT
                  </span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full neon-border bg-primary hover:bg-primary/90 font-semibold"
                onClick={handleCheckout}
              >
                <Wallet className="h-5 w-5 mr-2" />
                {walletConnected ? 'Proceed to Checkout' : 'Connect Wallet to Checkout'}
              </Button>
            </div>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  )
}