'use client'

import { APIProvider, Map } from '@vis.gl/react-google-maps'
import { Trip } from '../types'
import { LocationMarker } from './markers'
import { RouteRenderer } from './RouteRenderer'

interface TripMapProps {
  trip: Trip
  apiKey: string
}

const DEFAULT_CENTER = { lat: 0, lng: 0 }
const DEFAULT_ZOOM = 10

/**
 * Main map component that displays a trip with all its locations and routes
 */
export function TripMap({ trip, apiKey }: TripMapProps) {
  const center = trip.defaultCenter || trip.locations[0]?.coordinates || DEFAULT_CENTER
  const zoom = trip.defaultZoom || DEFAULT_ZOOM

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={center}
          defaultZoom={zoom}
          style={{ width: '100%', height: '100%' }}
          mapId="trip-map"
          disableDefaultUI={true}
          mapTypeControl={true}
          mapTypeControlOptions={{ style: 1, mapTypeIds: ['roadmap', 'satellite'] }}
        >
          {/* Render all location markers */}
          {trip.locations.map(location => (
            <LocationMarker key={location.id} location={location} />
          ))}

          {/* Render all routes */}
          {trip.routes.map(route => (
            <RouteRenderer key={route.id} route={route} locations={trip.locations} />
          ))}
        </Map>
      </APIProvider>
    </div>
  )
}
