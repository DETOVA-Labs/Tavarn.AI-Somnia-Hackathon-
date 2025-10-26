
import Hero from '@/components/Hero'
import FeaturedAssets from '@/components/FeaturedAssets'
import {Roadmap} from "@/components/Roadmap";
export default function Home() {


    return (
    <div className="dark min-h-screen relative">
      <Hero />
      <FeaturedAssets />
        <Roadmap />
    </div>
  )
}