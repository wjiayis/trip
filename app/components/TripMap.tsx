'use client'

import { useState, useCallback } from 'react'
import { APIProvider, Map as GoogleMap } from '@vis.gl/react-google-maps'
import { Trip, POICategory } from '../types'
import { LocationMarker } from './markers'
import { RouteRenderer } from './RouteRenderer'
import { POISearch } from './POISearch'
import { MapControls } from './MapControls'

interface TripMapProps {
  trip: Trip
  apiKey: string
}

const DEFAULT_CENTER = { lat: 0, lng: 0 }
const DEFAULT_ZOOM = 10

type RouteResultsMap = { [routeId: string]: google.maps.DirectionsResult }

/**
 * Main map component that displays a trip with all its locations and routes
 */
export function TripMap({ trip, apiKey }: TripMapProps) {
  const center = trip.defaultCenter || trip.locations[0]?.coordinates || DEFAULT_CENTER
  const zoom = trip.defaultZoom || DEFAULT_ZOOM

  const [routeResults, setRouteResults] = useState<RouteResultsMap>({})
  const [activePOI, setActivePOI] = useState<POICategory | null>(null)

  const handleRouteReady = useCallback((routeId: string, result: google.maps.DirectionsResult) => {
    setRouteResults(prev => ({ ...prev, [routeId]: result }))
  }, [])

  const handleTogglePOI = useCallback((category: POICategory) => {
    setActivePOI(prev => prev === category ? null : category)
  }, [])

  // Get the first route result for POI search
  const firstRouteResult = trip.routes.length > 0
    ? routeResults[trip.routes[0].id] || null
    : null

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <APIProvider apiKey={apiKey} libraries={['places', 'geometry']}>
        <MapControls
          activePOI={activePOI}
          onTogglePOI={handleTogglePOI}
          hasRoutes={trip.routes.length > 0}
        />
        <GoogleMap
          defaultCenter={center}
          defaultZoom={zoom}
          style={{ width: '100%', height: '100%' }}
          mapId="trip-map"
          disableDefaultUI={true}
        >
          {/* Render all location markers */}
          {trip.locations.map(location => (
            <LocationMarker key={location.id} location={location} />
          ))}

          {/* Render all routes */}
          {trip.routes.map(route => (
            <RouteRenderer
              key={route.id}
              route={route}
              locations={trip.locations}
              onRouteReady={(result) => handleRouteReady(route.id, result)}
            />
          ))}

          {/* POI Search results */}
          {activePOI && (
            <POISearch
              routeResult={firstRouteResult}
              category={activePOI}
              maxDetourMinutes={5}
              visible={activePOI !== null}
            />
          )}
        </GoogleMap>
      </APIProvider>
    </div>
  )
}
