"use client"

import { useState } from "react"
import { MapContainer, TileLayer, Polygon, useMapEvents } from "react-leaflet"
import type { LatLng } from "leaflet"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Layers, Square, Trash2 } from "lucide-react"
import "leaflet/dist/leaflet.css"

// Fix for default markers in react-leaflet
import L from "leaflet"
const DefaultIcon = L.Icon.Default.prototype as { _getIconUrl?: () => string }
delete DefaultIcon._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/placeholder.svg?height=50&width=25",
  iconUrl: "/placeholder.svg?height=25&width=25",
  shadowUrl: "/placeholder.svg?height=41&width=41",
})

interface DrawnPolygon {
  id: string
  positions: LatLng[]
  area: number
}

interface OverlayZone {
  id: string
  positions: LatLng[][]
  type: "microclimate" | "soil"
  name: string
  color: string
}

// Sample overlay data
const microclimatezones: OverlayZone[] = [
  {
    id: "mc1",
    positions: [
      [
        L.latLng(37.7849, -122.4094),
        L.latLng(37.7849, -122.4),
        L.latLng(37.78, -122.4),
        L.latLng(37.78, -122.4094),
      ],
    ],
    type: "microclimate",
    name: "Coastal Fog Zone",
    color: "#3b82f6",
  },
  {
    id: "mc2",
    positions: [
      [
        L.latLng(37.79, -122.415),
        L.latLng(37.79, -122.405),
        L.latLng(37.785, -122.405),
        L.latLng(37.785, -122.415),
      ],
    ],
    type: "microclimate",
    name: "Urban Heat Island",
    color: "#ef4444",
  },
]

const soilZones: OverlayZone[] = [
  {
    id: "soil1",
    positions: [
      [
        L.latLng(37.782, -122.412),
        L.latLng(37.782, -122.402),
        L.latLng(37.777, -122.402),
        L.latLng(37.777, -122.412),
      ],
    ],
    type: "soil",
    name: "Clay Loam",
    color: "#8b5cf6",
  },
  {
    id: "soil2",
    positions: [
      [
        L.latLng(37.788, -122.408),
        L.latLng(37.788, -122.398),
        L.latLng(37.783, -122.398),
        L.latLng(37.783, -122.408),
      ],
    ],
    type: "soil",
    name: "Sandy Soil",
    color: "#f59e0b",
  },
]

function DrawingControls({
  isDrawing,
  onToggleDrawing,
  onClearPolygons,
}: {
  isDrawing: boolean
  onToggleDrawing: () => void
  onClearPolygons: () => void
}) {
  return (
    <Card className="absolute top-4 left-4 z-[1000] w-64">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Square className="w-4 h-4" />
          Drawing Tools
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <Button
            variant={isDrawing ? "default" : "outline"}
            size="sm"
            onClick={onToggleDrawing}
            className="flex-1 mr-2"
          >
            {isDrawing ? "Stop Drawing" : "Draw Polygon"}
          </Button>
          <Button variant="outline" size="sm" onClick={onClearPolygons}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        {isDrawing && (
          <p className="text-xs text-muted-foreground">
            Click on the map to start drawing a polygon. Double-click to finish.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function LayerControls({
  showMicroclimate,
  showSoil,
  onToggleMicroclimate,
  onToggleSoil,
}: {
  showMicroclimate: boolean
  showSoil: boolean
  onToggleMicroclimate: () => void
  onToggleSoil: () => void
}) {
  return (
    <Card className="absolute top-4 right-4 z-[1000] w-64">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Layers className="w-4 h-4" />
          Map Layers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="microclimate" className="text-sm">
            Microclimate Zones
          </Label>
          <Switch id="microclimate" checked={showMicroclimate} onCheckedChange={onToggleMicroclimate} />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="soil" className="text-sm">
            Soil Types
          </Label>
          <Switch id="soil" checked={showSoil} onCheckedChange={onToggleSoil} />
        </div>
        <Separator />
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 opacity-30 rounded-sm"></div>
            <span>Coastal Fog Zone</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 opacity-30 rounded-sm"></div>
            <span>Urban Heat Island</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 opacity-30 rounded-sm"></div>
            <span>Clay Loam</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 opacity-30 rounded-sm"></div>
            <span>Sandy Soil</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PolygonDrawer({
  isDrawing,
  onPolygonComplete,
}: {
  isDrawing: boolean
  onPolygonComplete: (polygon: DrawnPolygon) => void
}) {
  const [currentPoints, setCurrentPoints] = useState<LatLng[]>([])

  useMapEvents({
    click: (e) => {
      if (!isDrawing) return

      const newPoints = [...currentPoints, e.latlng]
      setCurrentPoints(newPoints)
    },
    dblclick: () => {
      if (!isDrawing || currentPoints.length < 3) return

      const area = calculatePolygonArea(currentPoints)
      const polygon: DrawnPolygon = {
        id: Date.now().toString(),
        positions: currentPoints,
        area,
      }

      onPolygonComplete(polygon)
      setCurrentPoints([])
    },
  })

  if (!isDrawing || currentPoints.length === 0) return null

  return (
    <Polygon
      positions={currentPoints}
      pathOptions={{
        color: "#22c55e",
        fillColor: "#22c55e",
        fillOpacity: 0.2,
        weight: 2,
        dashArray: "5, 5",
      }}
    />
  )
}

function calculatePolygonArea(points: LatLng[]): number {
  if (points.length < 3) return 0

  let area = 0
  const n = points.length

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    area += points[i].lat * points[j].lng
    area -= points[j].lat * points[i].lng
  }

  return (Math.abs(area) / 2) * 111000 * 111000 // Rough conversion to square meters
}

export default function InteractiveMap() {
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawnPolygons, setDrawnPolygons] = useState<DrawnPolygon[]>([])
  const [showMicroclimate, setShowMicroclimate] = useState(true)
  const [showSoil, setShowSoil] = useState(true)

  const handlePolygonComplete = (polygon: DrawnPolygon) => {
    setDrawnPolygons((prev) => [...prev, polygon])
    setIsDrawing(false)
  }

  const handleClearPolygons = () => {
    setDrawnPolygons([])
    setIsDrawing(false)
  }

  const toggleDrawing = () => {
    setIsDrawing(!isDrawing)
  }

  return (
    <div className="relative w-full h-screen">
      <MapContainer center={[37.7849, -122.4094]} zoom={13} className="w-full h-full" zoomControl={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Microclimate Zone Overlays */}
        {showMicroclimate &&
          microclimatezones.map((zone) => (
            <Polygon
              key={zone.id}
              positions={zone.positions}
              pathOptions={{
                color: zone.color,
                fillColor: zone.color,
                fillOpacity: 0.15,
                weight: 1,
                opacity: 0.6,
              }}
            />
          ))}

        {/* Soil Type Overlays */}
        {showSoil &&
          soilZones.map((zone) => (
            <Polygon
              key={zone.id}
              positions={zone.positions}
              pathOptions={{
                color: zone.color,
                fillColor: zone.color,
                fillOpacity: 0.2,
                weight: 1,
                opacity: 0.7,
                dashArray: "3, 3",
              }}
            />
          ))}

        {/* Drawn Polygons */}
        {drawnPolygons.map((polygon) => (
          <Polygon
            key={polygon.id}
            positions={polygon.positions}
            pathOptions={{
              color: "#22c55e",
              fillColor: "#22c55e",
              fillOpacity: 0.3,
              weight: 2,
            }}
          />
        ))}

        <PolygonDrawer isDrawing={isDrawing} onPolygonComplete={handlePolygonComplete} />
      </MapContainer>

      <DrawingControls isDrawing={isDrawing} onToggleDrawing={toggleDrawing} onClearPolygons={handleClearPolygons} />

      <LayerControls
        showMicroclimate={showMicroclimate}
        showSoil={showSoil}
        onToggleMicroclimate={() => setShowMicroclimate(!showMicroclimate)}
        onToggleSoil={() => setShowSoil(!showSoil)}
      />

      {/* Status Panel */}
      {drawnPolygons.length > 0 && (
        <Card className="absolute bottom-4 left-4 z-[1000] w-64">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Drawn Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {drawnPolygons.map((polygon, index) => (
                <div key={polygon.id} className="flex justify-between">
                  <span>Area {index + 1}</span>
                  <span className="text-muted-foreground">{(polygon.area / 1000000).toFixed(2)} km²</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}