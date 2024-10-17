import { useState, useEffect, useRef } from 'react'
import { GoogleMap, useLoadScript } from '@react-google-maps/api'
import { MarkerClusterer } from '@googlemaps/markerclusterer'

const libraries = ['places']

const Map2 = ({ cafes }) => {
  const [currentLocation, setCurrentLocation] = useState({
    lat: 24.98535217294184,
    lng: 121.22179952631973,
  })
  const mapRef = useRef(null)
  const markerClusterRef = useRef(null)

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  })

  const onMapLoad = (map) => {
    mapRef.current = map
    createMarkerCluster(map, cafes)

    if (currentLocation) {
      new window.google.maps.Marker({
        position: currentLocation,
        map,
        title: '現在的位置',
      })
    }
  }

  const createMarkerCluster = (map, markers) => {
    if (markerClusterRef.current) {
      markerClusterRef.current.clearMarkers()
    }

    const googleMarkers = markers.map((cafe) => {
      const marker = new window.google.maps.Marker({
        position: {
          lat: parseFloat(cafe.latitude),
          lng: parseFloat(cafe.longitude),
        },
        title: cafe.name,
        icon: {
          url: 'bean.png',
          scaledSize: new window.google.maps.Size(22, 25), // 調整圖標大小
          origin: new window.google.maps.Point(0, 0), // 圖標的原點
          anchor: new window.google.maps.Point(15, 15), // 圖標的原點
        },
      })

      marker.addListener('click', () => {
        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div><strong>${cafe.name}</strong><br>${cafe.address}</div>`,
        })
        infoWindow.open(map, marker)
      })

      return marker
    })

    // 自定義標記群集的渲染樣式
    const renderer = {
      render({ count, position }) {
        const color = '#2b4f61'
        const svg = window.btoa(`
          <svg fill="${color}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
            <circle cx="120" cy="120" opacity=".8" r="70" />
          </svg>
        `)

        return new window.google.maps.Marker({
          position,
          icon: {
            url: `data:image/svg+xml;base64,${svg}`,
            scaledSize: new window.google.maps.Size(50, 50),
          },
          label: {
            text: String(count),
            color: 'rgba(255,255,255,1)',
            fontSize: '12px',
          },
          title: `Cluster of ${count} markers`,
          zIndex: Number(window.google.maps.Marker.MAX_ZINDEX) + count,
        })
      },
    }
    // 創建並設定標記群集
    markerClusterRef.current = new MarkerClusterer({
      markers: googleMarkers,
      map,
      renderer: renderer,
    })
  }

  // 取得使用者當前位置
  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            setCurrentLocation({ lat: latitude, lng: longitude })
          },
          (error) => {
            console.error('Error getting user location:', error)
          }
        )
      } else {
        console.log('Geolocation is not supported by this browser.')
      }
    }

    getUserLocation()
  }, [])

  useEffect(() => {
    if (mapRef.current && cafes.length > 0) {
      const bounds = new window.google.maps.LatLngBounds() // 獲取當前地圖的範圍
      let validCafes = 0
      cafes.forEach((cafe) => {
        const lat = parseFloat(cafe.latitude)
        const lng = parseFloat(cafe.longitude)
        // 咖啡店的經緯度是否在台灣的有效範圍內
        if (
          !isNaN(lat) &&
          !isNaN(lng) &&
          lat >= 21.9 &&
          lat <= 25.3 &&
          lng >= 119.3 &&
          lng <= 122.0
        ) {
          bounds.extend({ lat, lng })
          validCafes++
        }
      })

      if (validCafes > 0) {
        mapRef.current.fitBounds(bounds)

        const listener = mapRef.current.addListener('idle', () => {
          const zoom = mapRef.current.getZoom()
          if (zoom > 16) mapRef.current.setZoom(16)
          if (zoom < 7) mapRef.current.setZoom(7)
          window.google.maps.event.removeListener(listener)
        })
      } else if (currentLocation) {
        mapRef.current.setCenter(currentLocation)
        mapRef.current.setZoom(14)
      }

      createMarkerCluster(mapRef.current, cafes)
    } else if (mapRef.current && currentLocation) {
      mapRef.current.setCenter(currentLocation)
      mapRef.current.setZoom(14)
    }
  }, [cafes, currentLocation])

  if (!isLoaded) return <div>Loading....</div>

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px',
      }}
    >
      <GoogleMap
        zoom={7}
        center={currentLocation}
        mapContainerClassName="map"
        mapContainerStyle={{ width: '100%', height: '92vh', margin: 'auto' }}
        onLoad={onMapLoad}
        options={{
          minZoom: 7,
          maxZoom: 18,
        }}
      ></GoogleMap>
    </div>
  )
}

export default Map2
