'use client'

import { AdvancedMarker } from '@vis.gl/react-google-maps'
import { Location, MARKER_STYLES, DEFAULT_EMOJIS } from '../../types'

interface BadgeMarkerProps {
  location: Location
}

export function BadgeMarker({ location }: BadgeMarkerProps) {
  const emoji = location.emoji || DEFAULT_EMOJIS[location.type]

  return (
    <AdvancedMarker position={location.coordinates} title={location.name}>
      <div style={MARKER_STYLES.badge}>
        {emoji} {location.name}
      </div>
    </AdvancedMarker>
  )
}
