'use client'

import { useState, useEffect } from 'react'
import { useMapsLibrary } from '@vis.gl/react-google-maps'
import { Location, ResolvedLocation, Coordinates } from '../types'

interface UseGeocodedLocationsResult {
  locations: ResolvedLocation[]
  center: Coordinates | null
  loading: boolean
  error: string | null
}

/**
 * Hook to geocode locations and center point from search queries
 */
export function useGeocodedLocations(
  locations: Location[],
  defaultCenter?: string
): UseGeocodedLocationsResult {
  const geocodingLib = useMapsLibrary('geocoding')
  const [resolvedLocations, setResolvedLocations] = useState<ResolvedLocation[]>([])
  const [center, setCenter] = useState<Coordinates | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!geocodingLib) return

    const geocoder = new google.maps.Geocoder()

    async function geocodeAll() {
      setLoading(true)
      setError(null)

      const resolved: ResolvedLocation[] = []

      // Geocode all locations
      for (const location of locations) {
        try {
          const result = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
            geocoder.geocode({ address: location.query }, (results, status) => {
              if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
                resolve(results)
              } else {
                reject(new Error(`Geocoding failed for "${location.query}": ${status}`))
              }
            })
          })

          const coords = result[0].geometry.location
          resolved.push({
            ...location,
            coordinates: {
              lat: coords.lat(),
              lng: coords.lng()
            }
          })
          console.log(`Geocoded "${location.name}":`, coords.lat(), coords.lng())
        } catch (err) {
          console.error(err)
          setError(`Failed to geocode: ${location.name}`)
        }
      }

      setResolvedLocations(resolved)

      // Geocode center if provided, otherwise use first location
      if (defaultCenter) {
        try {
          const result = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
            geocoder.geocode({ address: defaultCenter }, (results, status) => {
              if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
                resolve(results)
              } else {
                reject(new Error(`Center geocoding failed: ${status}`))
              }
            })
          })

          const coords = result[0].geometry.location
          setCenter({ lat: coords.lat(), lng: coords.lng() })
          console.log(`Geocoded center "${defaultCenter}":`, coords.lat(), coords.lng())
        } catch (err) {
          console.error(err)
          // Fall back to first resolved location
          if (resolved.length > 0) {
            setCenter(resolved[0].coordinates)
          }
        }
      } else if (resolved.length > 0) {
        setCenter(resolved[0].coordinates)
      }

      setLoading(false)
    }

    geocodeAll()
  }, [geocodingLib, locations, defaultCenter])

  return { locations: resolvedLocations, center, loading, error }
}
