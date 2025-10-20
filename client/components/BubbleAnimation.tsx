"use client"

import { useEffect, useState } from 'react'

export default function BubbleAnimation() {
  const [bubbles, setBubbles] = useState<Array<{
    id: number
    left: number
    delay: number
    duration: number
    size: number
  }>>([])

  useEffect(() => {
    // Create initial bubbles
    const initialBubbles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 12 + Math.random() * 12,
      size: 30 + Math.random() * 80,
    }))
    setBubbles(initialBubbles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute bottom-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-md animate-bubble"
          style={{
            left: `${bubble.left}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            animationDelay: `${bubble.delay}s`,
            animationDuration: `${bubble.duration}s`,
          }}
        />
      ))}
    </div>
  )
}