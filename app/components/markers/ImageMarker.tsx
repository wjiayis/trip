'use client'

import { AdvancedMarker } from '@vis.gl/react-google-maps'
import { ResolvedLocation, MARKER_STYLES } from '../../types'

interface ImageMarkerProps {
  location: ResolvedLocation
}

export function ImageMarker({ location }: ImageMarkerProps) {
  if (!location.image) {
    console.warn(`ImageMarker: No image provided for location ${location.id}`)
    return null
  }

  return (
    <AdvancedMarker position={location.coordinates} title={location.name}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img
          src={location.image}
          alt={location.name}
          style={MARKER_STYLES.image}
        />
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: '10px solid white',
            marginTop: -2
          }}
        />
      </div>
    </AdvancedMarker>
  )
}
