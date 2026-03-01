'use client'

import { useState, useCallback } from 'react'
import { APIProvider, Map as GoogleMap } from '@vis.gl/react-google-maps'
import { Trip, POICategory } from '../types'
import { LocationMarker } from './markers'
import { RouteRenderer } from './RouteRenderer'
import { POISearch } from './POISearch'
import { MapControls } from './MapControls'
import { useGeocodedLocations } from '../hooks'

interface TripMapProps {
  trip: Trip
  apiKey: string
}

const DEFAULT_CENTER = { lat: 0, lng: 0 }
const DEFAULT_ZOOM = 10

type RouteResultsMap = { [routeId: string]: google.maps.DirectionsResult }

function TripMapContent({ trip }: { trip: Trip }) {
  const { locations, center, loading, error } = useGeocodedLocations(
    trip.locations,
    trip.defaultCenter
  )

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

  if (loading) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5'
      }}>
        <div style={{
          background: 'white',
          padding: '20px 30px',
          borderRadius: 8,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          Loading locations...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5'
      }}>
        <div style={{
          background: '#ffebee',
          padding: '20px 30px',
          borderRadius: 8,
          color: '#c62828'
        }}>
          {error}
        </div>
      </div>
    )
  }

  const mapCenter = center || DEFAULT_CENTER

  return (
    <>
      <MapControls
        activePOI={activePOI}
        onTogglePOI={handleTogglePOI}
        hasRoutes={trip.routes.length > 0}
      />
      <GoogleMap
        defaultCenter={mapCenter}
        defaultZoom={trip.defaultZoom || DEFAULT_ZOOM}
        style={{ width: '100%', height: '100%' }}
        mapId="trip-map"
        disableDefaultUI={true}
        mapTypeControl={true}
        mapTypeControlOptions={{ style: 1, mapTypeIds: ['roadmap', 'satellite'] }}
      >
        {/* Render all location markers */}
        {locations.map(location => (
          <LocationMarker key={location.id} location={location} />
        ))}

        {/* Render all routes */}
        {trip.routes.map(route => (
          <RouteRenderer
            key={route.id}
            route={route}
            locations={locations}
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
    </>
  )
}

/**
 * Main map component that displays a trip with all its locations and routes
 */
export function TripMap({ trip, apiKey }: TripMapProps) {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <APIProvider apiKey={apiKey} libraries={['places', 'geometry', 'geocoding']}>
        <TripMapContent trip={trip} />
      </APIProvider>
    </div>
  )
}
