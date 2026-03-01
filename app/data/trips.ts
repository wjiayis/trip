import { Trip } from '../types'

// Lofoten Islands Trip
export const lofotenTrip: Trip = {
  id: 'lofoten-2024',
  name: 'Lofoten Islands Adventure',
  description: 'Exploring the stunning Lofoten archipelago in Northern Norway',
  defaultCenter: { lat: 68.1525, lng: 13.6094 },
  defaultZoom: 10,
  locations: [
    {
      id: 'leknes-airport',
      name: 'Leknes Airport',
      coordinates: { lat: 68.1525, lng: 13.6094 },
      type: 'airport',
      emoji: '✈️',
      markerStyle: 'badge',
      description: 'Main airport serving the Lofoten Islands'
    },
    {
      id: 'eliassen-rorbuer',
      name: 'Eliassen Rorbuer',
      coordinates: { lat: 68.0294, lng: 13.1011 },
      type: 'accommodation',
      emoji: '🏠',
      markerStyle: 'badge',
      description: 'Traditional Norwegian fishing cabins in Hamnøy'
    }
  ],
  routes: [
    {
      id: 'airport-to-accommodation',
      originId: 'leknes-airport',
      destinationId: 'eliassen-rorbuer',
      travelMode: 'driving'
    }
  ],
  activities: [
    {
      id: 'arrival',
      locationId: 'leknes-airport',
      name: 'Arrive at Leknes',
      description: 'Land at Leknes Airport and pick up rental car',
      duration: '1 hour',
      order: 1
    },
    {
      id: 'check-in',
      locationId: 'eliassen-rorbuer',
      name: 'Check in at Eliassen Rorbuer',
      description: 'Settle into the traditional rorbuer cabin',
      duration: '30 minutes',
      order: 2
    }
  ]
}

// Riisitunturi Trip (Finland)
export const riisitunturiTrip: Trip = {
  id: 'riisitunturi-2024',
  name: 'Riisitunturi National Park',
  description: 'Winter wonderland in Finnish Lapland',
  defaultCenter: { lat: 66.2567, lng: 28.5167 },
  defaultZoom: 12,
  locations: [
    {
      id: 'riisitunturi-park',
      name: 'Riisitunturi National Park',
      coordinates: { lat: 66.2567, lng: 28.5167 },
      type: 'attraction',
      image: '/riisitunturi.jpg',
      markerStyle: 'image',
      description: 'Famous for its snow-crowned trees (tykky) in winter'
    }
  ],
  routes: [],
  activities: [
    {
      id: 'snowshoe-hike',
      locationId: 'riisitunturi-park',
      name: 'Snowshoe Hiking',
      description: 'Explore the frozen forest and crown snow trees',
      duration: '4 hours',
      order: 1
    }
  ]
}

// Combined trip (original behavior)
export const combinedNordicTrip: Trip = {
  id: 'nordic-adventure-2024',
  name: 'Nordic Adventure',
  description: 'Exploring Norway and Finland',
  defaultCenter: { lat: 68.1525, lng: 13.6094 },
  defaultZoom: 10,
  locations: [
    {
      id: 'riisitunturi-park',
      name: 'Riisitunturi National Park',
      coordinates: { lat: 66.2567, lng: 28.5167 },
      type: 'attraction',
      image: '/riisitunturi.jpg',
      markerStyle: 'image',
      description: 'Famous for its snow-crowned trees (tykky) in winter'
    },
    {
      id: 'leknes-airport',
      name: 'Leknes Airport',
      coordinates: { lat: 68.1525, lng: 13.6094 },
      type: 'airport',
      emoji: '✈️',
      markerStyle: 'badge',
      description: 'Main airport serving the Lofoten Islands'
    },
    {
      id: 'eliassen-rorbuer',
      name: 'Eliassen Rorbuer',
      coordinates: { lat: 68.0294, lng: 13.1011 },
      type: 'accommodation',
      emoji: '🏠',
      markerStyle: 'badge',
      description: 'Traditional Norwegian fishing cabins in Hamnøy'
    }
  ],
  routes: [
    {
      id: 'airport-to-accommodation',
      originId: 'leknes-airport',
      destinationId: 'eliassen-rorbuer',
      travelMode: 'driving'
    }
  ],
  activities: [
    {
      id: 'riisitunturi-visit',
      locationId: 'riisitunturi-park',
      name: 'Visit Riisitunturi',
      description: 'Explore the snow-covered national park',
      duration: '1 day',
      order: 1
    },
    {
      id: 'fly-to-lofoten',
      locationId: 'leknes-airport',
      name: 'Fly to Lofoten',
      description: 'Arrive at Leknes Airport',
      duration: '2 hours',
      order: 2
    },
    {
      id: 'drive-to-rorbuer',
      locationId: 'eliassen-rorbuer',
      name: 'Drive to Eliassen Rorbuer',
      description: 'Scenic drive through Lofoten to accommodation',
      duration: '45 minutes',
      order: 3
    }
  ]
}

// Export all trips
export const ALL_TRIPS: Trip[] = [
  lofotenTrip,
  riisitunturiTrip,
  combinedNordicTrip
]

// Default trip to display
export const DEFAULT_TRIP = combinedNordicTrip
