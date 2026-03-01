'use client'

import { TripMap } from './components'
import { DEFAULT_TRIP } from './data/trips'

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

  return <TripMap trip={DEFAULT_TRIP} apiKey={apiKey} />
}
