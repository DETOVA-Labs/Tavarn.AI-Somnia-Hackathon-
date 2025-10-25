"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import {ConnectButton} from "@rainbow-me/rainbowkit";
import Image from "next/image";

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-primary/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
              <Image src={'/tarvanLogo.png'} alt={'Tarvan.IA'} width={200} height={200} />
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

            <ConnectButton />

          </div>
            <div className="flex md:hidden items-center space-x-2">

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
              <ConnectButton />
            </div>
          </div>
        )}
      </nav>
    </>
  )
}