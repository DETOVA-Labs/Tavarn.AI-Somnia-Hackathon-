import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import FeaturedAssets from '@/components/FeaturedAssets'
import BubbleAnimation from '@/components/BubbleAnimation'

export default function Home() {
  return (
    <div className="dark min-h-screen relative">
      <BubbleAnimation />
      <Navigation />
      <Hero />
      <FeaturedAssets />
    </div>
  )
}