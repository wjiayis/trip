'use client'

import { Location } from '../../types'
import { BadgeMarker } from './BadgeMarker'
import { ImageMarker } from './ImageMarker'

interface LocationMarkerProps {
  location: Location
}

/**
 * Renders the appropriate marker component based on the location's markerStyle
 */
export function LocationMarker({ location }: LocationMarkerProps) {
  switch (location.markerStyle) {
    case 'image':
      return <ImageMarker location={location} />
    case 'badge':
    default:
      return <BadgeMarker location={location} />
  }
}
