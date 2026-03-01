// Core coordinate type
export interface Coordinates {
  lat: number
  lng: number
}

// Location types for categorization
export type LocationType = 'airport' | 'accommodation' | 'attraction' | 'restaurant' | 'activity' | 'transport'

// Marker display styles
export type MarkerStyle = 'badge' | 'image' | 'pin'

// Location definition
export interface Location {
  id: string
  name: string
  coordinates: Coordinates
  type: LocationType
  emoji?: string
  image?: string
  description?: string
  markerStyle: MarkerStyle
}

// Travel modes for routes
export type TravelMode = 'driving' | 'walking' | 'transit' | 'bicycling'

// Route style configuration
export interface RouteStyle {
  strokeColor: string
  strokeWeight: number
  strokeOpacity?: number
}

// Route definition
export interface Route {
  id: string
  originId: string
  destinationId: string
  travelMode: TravelMode
  style?: RouteStyle
}

// Activity definition
export interface Activity {
  id: string
  locationId: string
  name: string
  description?: string
  duration?: string
  order: number
}

// Trip definition - the main container
export interface Trip {
  id: string
  name: string
  description?: string
  locations: Location[]
  routes: Route[]
  activities: Activity[]
  defaultCenter?: Coordinates
  defaultZoom?: number
}

// Default route styles by travel mode
export const DEFAULT_ROUTE_STYLES: Record<TravelMode, RouteStyle> = {
  driving: { strokeColor: '#4285F4', strokeWeight: 5 },
  walking: { strokeColor: '#34A853', strokeWeight: 4 },
  transit: { strokeColor: '#FBBC04', strokeWeight: 5 },
  bicycling: { strokeColor: '#EA4335', strokeWeight: 4 }
}

// Marker style configurations
export const MARKER_STYLES = {
  badge: {
    background: 'white',
    padding: '6px 10px',
    borderRadius: 6,
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
    fontWeight: 500,
    fontSize: 12
  },
  image: {
    width: 72,
    height: 72,
    objectFit: 'cover' as const,
    borderRadius: 8,
    border: '2px solid white',
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
  }
}

// Default emojis for location types
export const DEFAULT_EMOJIS: Record<LocationType, string> = {
  airport: '✈️',
  accommodation: '🏠',
  attraction: '📍',
  restaurant: '🍽️',
  activity: '🎯',
  transport: '🚗'
}

// Point of Interest from Places API
export interface POI {
  id: string
  name: string
  coordinates: Coordinates
  address?: string
  rating?: number
  detourSeconds?: number
}

// POI search category
export type POICategory = 'grocery' | 'gas_station' | 'restaurant' | 'cafe' | 'pharmacy'

// POI category configuration
export const POI_CONFIG: Record<POICategory, { type: string; emoji: string; label: string }> = {
  grocery: { type: 'grocery_or_supermarket', emoji: '🛒', label: 'Grocery' },
  gas_station: { type: 'gas_station', emoji: '⛽', label: 'Gas Station' },
  restaurant: { type: 'restaurant', emoji: '🍽️', label: 'Restaurant' },
  cafe: { type: 'cafe', emoji: '☕', label: 'Cafe' },
  pharmacy: { type: 'pharmacy', emoji: '💊', label: 'Pharmacy' }
}
