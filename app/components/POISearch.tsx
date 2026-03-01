'use client'

import { useCallback, useState, useEffect } from 'react'
import { useMap, useMapsLibrary, AdvancedMarker } from '@vis.gl/react-google-maps'
import { POI, POICategory, POI_CONFIG, Coordinates, MARKER_STYLES } from '../types'

interface POISearchProps {
  routeResult: google.maps.DirectionsResult | null
  category: POICategory
  maxDetourMinutes: number
  visible: boolean
}

/**
 * Sample points along a route path at regular intervals
 */
function sampleRoutePoints(route: google.maps.DirectionsRoute, intervalMeters: number = 3000): Coordinates[] {
  const points: Coordinates[] = []
  const leg = route.legs[0]
  if (!leg) return points

  // Always include start
  if (leg.start_location) {
    points.push({ lat: leg.start_location.lat(), lng: leg.start_location.lng() })
  }

  // If geometry library is available, sample along the path
  if (typeof google !== 'undefined' && google.maps.geometry?.spherical) {
    let distanceAccum = 0

    for (const step of leg.steps) {
      const path = step.path
      if (!path || path.length < 2) continue

      for (let i = 0; i < path.length - 1; i++) {
        const start = path[i]
        const end = path[i + 1]
        const segmentDistance = google.maps.geometry.spherical.computeDistanceBetween(start, end)

        distanceAccum += segmentDistance
        if (distanceAccum >= intervalMeters) {
          points.push({ lat: end.lat(), lng: end.lng() })
          distanceAccum = 0
        }
      }
    }
  }

  // Always include end
  if (leg.end_location) {
    points.push({ lat: leg.end_location.lat(), lng: leg.end_location.lng() })
  }

  console.log(`Sampled ${points.length} points along route`)
  return points
}

/**
 * Search for POIs along a route and filter by detour time
 */
export function POISearch({ routeResult, category, maxDetourMinutes, visible }: POISearchProps) {
  const map = useMap()
  const placesLib = useMapsLibrary('places')
  // Load geometry library for distance calculations
  useMapsLibrary('geometry')
  const [pois, setPois] = useState<POI[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const searchPOIs = useCallback(async () => {
    if (!map || !placesLib || !routeResult) {
      console.log('POISearch: Missing dependencies', { map: !!map, placesLib: !!placesLib, routeResult: !!routeResult })
      return
    }

    console.log('POISearch: Starting search for', category)
    setLoading(true)
    setPois([])

    const route = routeResult.routes[0]
    if (!route) {
      console.log('POISearch: No route found in result')
      setLoading(false)
      return
    }

    const samplePoints = sampleRoutePoints(route)
    if (samplePoints.length === 0) {
      console.log('POISearch: No sample points')
      setLoading(false)
      return
    }

    const config = POI_CONFIG[category]
    const foundPlaces = new Map<string, POI>()

    // Get original route duration
    const originalDuration = route.legs[0]?.duration?.value || 0
    console.log('Original route duration:', originalDuration, 'seconds')

    // Search near each sample point
    const service = new google.maps.places.PlacesService(map)

    for (const point of samplePoints) {
      const request: google.maps.places.PlaceSearchRequest = {
        location: new google.maps.LatLng(point.lat, point.lng),
        radius: 3000, // 3km radius
        type: config.type
      }

      try {
        const results = await new Promise<google.maps.places.PlaceResult[]>((resolve, reject) => {
          service.nearbySearch(request, (results, status) => {
            console.log(`Places search at (${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}): ${status}, ${results?.length || 0} results`)
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
              resolve(results)
            } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
              resolve([])
            } else {
              reject(new Error(status))
            }
          })
        })

        for (const place of results) {
          if (place.place_id && place.geometry?.location && !foundPlaces.has(place.place_id)) {
            foundPlaces.set(place.place_id, {
              id: place.place_id,
              name: place.name || 'Unknown',
              coordinates: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
              },
              address: place.vicinity,
              rating: place.rating
            })
          }
        }
      } catch (err) {
        console.warn('Places search failed for point:', point, err)
      }
    }

    console.log(`Found ${foundPlaces.size} unique places, calculating detours...`)

    // If no places found, show message and return
    if (foundPlaces.size === 0) {
      console.log('No places found along route')
      setLoading(false)
      setSearched(true)
      return
    }

    // Calculate detour time for each POI
    const directionsService = new google.maps.DirectionsService()
    const origin = route.legs[0]?.start_location
    const destination = route.legs[0]?.end_location

    if (!origin || !destination) {
      console.log('POISearch: Missing origin or destination')
      setLoading(false)
      return
    }

    const poisWithDetour: POI[] = []
    const maxDetourSeconds = maxDetourMinutes * 60

    for (const poi of Array.from(foundPlaces.values())) {
      try {
        const detourRoute = await directionsService.route({
          origin,
          destination,
          waypoints: [{ location: new google.maps.LatLng(poi.coordinates.lat, poi.coordinates.lng), stopover: true }],
          travelMode: google.maps.TravelMode.DRIVING
        })

        const detourDuration = detourRoute.routes[0]?.legs.reduce((sum, leg) => sum + (leg.duration?.value || 0), 0) || 0
        const detourTime = detourDuration - originalDuration

        console.log(`${poi.name}: detour = ${Math.round(detourTime / 60)} min`)

        if (detourTime <= maxDetourSeconds) {
          poisWithDetour.push({
            ...poi,
            detourSeconds: detourTime
          })
        }
      } catch (err) {
        console.warn('Detour calculation failed for:', poi.name, err)
      }
    }

    console.log(`${poisWithDetour.length} places within ${maxDetourMinutes} min detour`)

    // Sort by detour time and limit results
    poisWithDetour.sort((a, b) => (a.detourSeconds || 0) - (b.detourSeconds || 0))
    setPois(poisWithDetour.slice(0, 10))
    setLoading(false)
    setSearched(true)
  }, [map, placesLib, routeResult, category, maxDetourMinutes])

  // Trigger search when visible and not yet searched
  useEffect(() => {
    if (visible && !searched && !loading && routeResult && placesLib) {
      searchPOIs()
    }
  }, [visible, searched, loading, routeResult, placesLib, searchPOIs])

  // Reset when hidden
  useEffect(() => {
    if (!visible && searched) {
      setSearched(false)
      setPois([])
    }
  }, [visible, searched])

  if (!visible) return null

  const config = POI_CONFIG[category]

  return (
    <>
      {loading && (
        <div style={{
          position: 'absolute',
          top: 70,
          left: 10,
          background: 'white',
          padding: '8px 12px',
          borderRadius: 6,
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          fontSize: 12,
          zIndex: 1
        }}>
          Searching for {config.label.toLowerCase()}s...
        </div>
      )}

      {!loading && searched && pois.length === 0 && (
        <div style={{
          position: 'absolute',
          top: 70,
          left: 10,
          background: 'white',
          padding: '8px 12px',
          borderRadius: 6,
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          fontSize: 12,
          zIndex: 1
        }}>
          No {config.label.toLowerCase()}s found within {maxDetourMinutes} min detour
        </div>
      )}

      {pois.map(poi => (
        <AdvancedMarker key={poi.id} position={poi.coordinates} title={poi.name}>
          <div style={{
            ...MARKER_STYLES.badge,
            background: '#e8f5e9',
            border: '1px solid #4caf50',
            maxWidth: 150
          }}>
            <div style={{ fontWeight: 600 }}>{config.emoji} {poi.name}</div>
            {poi.detourSeconds !== undefined && (
              <div style={{ fontSize: 10, color: '#666', marginTop: 2 }}>
                +{Math.round(poi.detourSeconds / 60)} min detour
              </div>
            )}
          </div>
        </AdvancedMarker>
      ))}
    </>
  )
}
