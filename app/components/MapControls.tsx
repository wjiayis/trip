'use client'

import { POICategory, POI_CONFIG } from '../types'

interface MapControlsProps {
  activePOI: POICategory | null
  onTogglePOI: (category: POICategory) => void
  hasRoutes: boolean
}

const buttonStyle: React.CSSProperties = {
  background: 'white',
  border: 'none',
  padding: '10px 14px',
  borderRadius: 8,
  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 500,
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  transition: 'background 0.2s'
}

const activeStyle: React.CSSProperties = {
  ...buttonStyle,
  background: '#e8f5e9',
  border: '2px solid #4caf50'
}

export function MapControls({ activePOI, onTogglePOI, hasRoutes }: MapControlsProps) {
  if (!hasRoutes) return null

  return (
    <div style={{
      position: 'absolute',
      top: 10,
      left: 10,
      display: 'flex',
      gap: 8,
      zIndex: 1
    }}>
      <button
        style={activePOI === 'grocery' ? activeStyle : buttonStyle}
        onClick={() => onTogglePOI('grocery')}
        onMouseOver={e => {
          if (activePOI !== 'grocery') {
            e.currentTarget.style.background = '#f5f5f5'
          }
        }}
        onMouseOut={e => {
          if (activePOI !== 'grocery') {
            e.currentTarget.style.background = 'white'
          }
        }}
      >
        {POI_CONFIG.grocery.emoji} Grocery Along Route
      </button>
    </div>
  )
}
