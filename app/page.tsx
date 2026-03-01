'use client'

import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps'

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

  const riisitunturi = { lat: 66.2567, lng: 28.5167 }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={riisitunturi}
          defaultZoom={10}
          style={{ width: '100%', height: '100%' }}
          mapId="trip-map"
        >
          <AdvancedMarker position={riisitunturi} title="Riisitunturi National Park">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img
                src="/riisitunturi.jpg"
                alt="Riisitunturi National Park"
                style={{
                  width: 72,
                  height: 72,
                  objectFit: 'cover',
                  borderRadius: 8,
                  border: '2px solid white',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                }}
              />
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderTop: '10px solid white',
                  marginTop: -2
                }}
              />
            </div>
          </AdvancedMarker>
        </Map>
      </APIProvider>
    </div>
  )
}
