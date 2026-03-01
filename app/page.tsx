'use client'

import { APIProvider, Map } from '@vis.gl/react-google-maps'

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={{ lat: 37.7749, lng: -122.4194 }}
          defaultZoom={12}
          style={{ width: '100%', height: '100%' }}
        />
      </APIProvider>
    </div>
  )
}
