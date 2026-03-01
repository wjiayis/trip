'use client'

import { useEffect } from 'react'
import { APIProvider, Map, AdvancedMarker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps'

function Directions({ origin, destination }: { origin: google.maps.LatLngLiteral; destination: google.maps.LatLngLiteral }) {
  const map = useMap()
  const routesLibrary = useMapsLibrary('routes')

  useEffect(() => {
    if (!map || !routesLibrary) return

    const directionsService = new google.maps.DirectionsService()
    const directionsRenderer = new google.maps.DirectionsRenderer({
      map,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#4285F4',
        strokeWeight: 5
      }
    })

    directionsService.route({
      origin,
      destination,
      travelMode: google.maps.TravelMode.DRIVING
    }).then(response => {
      directionsRenderer.setDirections(response)
    }).catch(err => {
      console.error('Directions request failed:', err)
    })

    return () => directionsRenderer.setMap(null)
  }, [map, routesLibrary, origin, destination])

  return null
}

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

  const riisitunturi = { lat: 66.2567, lng: 28.5167 }
  const leknesAirport = { lat: 68.1525, lng: 13.6094 }
  const eliassenRorbuer = { lat: 68.0294, lng: 13.1011 }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={leknesAirport}
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
          <AdvancedMarker position={leknesAirport} title="Leknes Airport">
            <div
              style={{
                background: 'white',
                padding: '6px 10px',
                borderRadius: 6,
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                fontWeight: 500,
                fontSize: 12
              }}
            >
              ✈️ Leknes Airport
            </div>
          </AdvancedMarker>
          <AdvancedMarker position={eliassenRorbuer} title="Eliassen Rorbuer">
            <div
              style={{
                background: 'white',
                padding: '6px 10px',
                borderRadius: 6,
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                fontWeight: 500,
                fontSize: 12
              }}
            >
              🏠 Eliassen Rorbuer
            </div>
          </AdvancedMarker>
          <Directions origin={leknesAirport} destination={eliassenRorbuer} />
        </Map>
      </APIProvider>
    </div>
  )
}
