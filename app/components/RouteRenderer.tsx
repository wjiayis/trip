'use client'

import { useEffect } from 'react'
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps'
import { Route, Location, DEFAULT_ROUTE_STYLES, TravelMode } from '../types'

interface RouteRendererProps {
  route: Route
  locations: Location[]
}

function getTravelMode(mode: TravelMode): google.maps.TravelMode {
  const modes: Record<TravelMode, google.maps.TravelMode> = {
    driving: google.maps.TravelMode.DRIVING,
    walking: google.maps.TravelMode.WALKING,
    transit: google.maps.TravelMode.TRANSIT,
    bicycling: google.maps.TravelMode.BICYCLING
  }
  return modes[mode]
}

/**
 * Renders a route between two locations on the map
 */
export function RouteRenderer({ route, locations }: RouteRendererProps) {
  const map = useMap()
  const routesLibrary = useMapsLibrary('routes')

  useEffect(() => {
    if (!map || !routesLibrary) return

    const origin = locations.find(l => l.id === route.originId)
    const destination = locations.find(l => l.id === route.destinationId)

    if (!origin || !destination) {
      console.warn(`RouteRenderer: Could not find locations for route ${route.id}`)
      return
    }

    const style = route.style || DEFAULT_ROUTE_STYLES[route.travelMode]
    const travelMode = getTravelMode(route.travelMode)

    const directionsService = new google.maps.DirectionsService()
    const directionsRenderer = new google.maps.DirectionsRenderer({
      map,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: style.strokeColor,
        strokeWeight: style.strokeWeight,
        strokeOpacity: style.strokeOpacity ?? 1
      }
    })

    directionsService
      .route({
        origin: origin.coordinates,
        destination: destination.coordinates,
        travelMode
      })
      .then(response => {
        directionsRenderer.setDirections(response)
      })
      .catch(err => {
        console.error('Directions request failed:', err)
      })

    return () => directionsRenderer.setMap(null)
  }, [map, routesLibrary, route, locations])

  return null
}
