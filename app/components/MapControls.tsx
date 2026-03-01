'use client'

import { POICategory, POI_CONFIG } from '../types'

interface MapControlsProps {
  activePOI: POICategory | null
  onTogglePOI: (category: POICategory) => void
  hasRoutes: boolean
}

// POI categories to show in the control bar
const POI_BUTTONS: { category: POICategory; label: string }[] = [
  { category: 'grocery', label: 'Groceries' },
  { category: 'gas_station', label: 'Petrol' }
]

const buttonStyle: React.CSSProperties = {
  background: 'white',
  border: '2px solid transparent',
  padding: '8px 14px',
  borderRadius: 20,
  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 500,
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  transition: 'all 0.2s',
  whiteSpace: 'nowrap' as const,
  flexShrink: 0
}

const activeStyle: React.CSSProperties = {
  ...buttonStyle,
  background: '#e8f5e9',
  borderColor: '#4caf50'
}

export function MapControls({ activePOI, onTogglePOI, hasRoutes }: MapControlsProps) {
  if (!hasRoutes) return null

  return (
    <div style={{
      position: 'absolute',
      top: 10,
      left: 10,
      right: 10,
      zIndex: 1,
      overflowX: 'auto',
      overflowY: 'hidden',
      WebkitOverflowScrolling: 'touch',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none'
    }}>
      <div style={{
        display: 'flex',
        gap: 8,
        paddingBottom: 4
      }}>
        {POI_BUTTONS.map(({ category, label }) => {
          const isActive = activePOI === category
          const config = POI_CONFIG[category]

          return (
            <button
              key={category}
              style={isActive ? activeStyle : buttonStyle}
              onClick={() => onTogglePOI(category)}
              onMouseOver={e => {
                if (!isActive) {
                  e.currentTarget.style.background = '#f5f5f5'
                }
              }}
              onMouseOut={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'white'
                }
              }}
            >
              {config.emoji} {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
