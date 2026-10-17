import { useRef } from 'react'
import { BrandStory } from '../components/BrandStory'
import { CategorySection } from '../components/CategorySection'
import { FeaturedCollection } from '../components/FeaturedCollection'
import { Hero } from '../components/Hero'
import { NewArrivals } from '../components/NewArrivals'
import { Newsletter } from '../components/Newsletter'
import { FittingRoomSection } from '../components/studio/FittingRoomSection'

export function HomePage() {
  const featuredRef = useRef<HTMLDivElement>(null)
  return (
    <>
      <Hero onScrollNext={() => featuredRef.current?.previousElementSibling?.scrollIntoView({ behavior: 'smooth' })} />
      <CategorySection />
      <FeaturedCollection ref={featuredRef} />
      <FittingRoomSection />
      <NewArrivals />
      <BrandStory />
      <Newsletter />
    </>
  )
}
