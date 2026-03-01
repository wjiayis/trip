import { Trip, Location, Activity, Route, Coordinates, ResolvedLocation } from '../types'

/**
 * Find a location in a trip by its ID
 */
export function getLocationById(trip: Trip, locationId: string): Location | undefined {
  return trip.locations.find(l => l.id === locationId)
}

/**
 * Find a resolved location by its ID
 */
export function getResolvedLocationById(
  locations: ResolvedLocation[],
  locationId: string
): ResolvedLocation | undefined {
  return locations.find(l => l.id === locationId)
}

/**
 * Get activities for a specific location
 */
export function getActivitiesForLocation(trip: Trip, locationId: string): Activity[] {
  return trip.activities.filter(a => a.locationId === locationId)
}

/**
 * Get activities sorted by their order
 */
export function getSortedActivities(trip: Trip): Activity[] {
  return [...trip.activities].sort((a, b) => a.order - b.order)
}

/**
 * Get routes that start or end at a specific location
 */
export function getRoutesForLocation(trip: Trip, locationId: string): Route[] {
  return trip.routes.filter(r => r.originId === locationId || r.destinationId === locationId)
}

/**
 * Calculate the center point of all resolved locations
 */
export function calculateCenter(locations: ResolvedLocation[]): Coordinates {
  if (locations.length === 0) return { lat: 0, lng: 0 }

  const sum = locations.reduce(
    (acc, loc) => ({
      lat: acc.lat + loc.coordinates.lat,
      lng: acc.lng + loc.coordinates.lng
    }),
    { lat: 0, lng: 0 }
  )

  return {
    lat: sum.lat / locations.length,
    lng: sum.lng / locations.length
  }
}

/**
 * Get the itinerary as an ordered list of locations based on activities
 */
export function getItinerary(trip: Trip): Location[] {
  const sortedActivities = getSortedActivities(trip)
  const locationIds = Array.from(new Set(sortedActivities.map(a => a.locationId)))
  return locationIds
    .map(id => getLocationById(trip, id))
    .filter((loc): loc is Location => loc !== undefined)
}
