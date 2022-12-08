import { Controller } from "@hotwired/stimulus"
import polyline from "@mapbox/polyline"

// Connects to data-controller="map"
export default class extends Controller {
  static values = {
    apiKey: String,
    routes: Array,
    bounds: Array,
    markers: Array,
    warnings: Array,
    departure: String
  }

  static targets = ["instruction", "next-instruction"]

  async connect() {
    mapboxgl.accessToken = this.apiKeyValue

    this.map = new mapboxgl.Map({
      container: this.element,
      style: "mapbox://styles/hugsdanielwags/clbf0lrwz004n14o0rhtsjr59"
    })

    await this.#getUserPosition()

    this.#addMarkersToMap()
    this.#fitMapToMarkers()

    this.#addSections()
  }

  #askBrowserForPosition() {
    return new Promise(function(resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject)
    })
  }

  async #getUserPosition() {
    const input = document.querySelector("#itinerary_departure")
    if (!input) return

    this.userPosition = await this.#askBrowserForPosition()

    this.#addOriginMarker()
    this.#changeOriginInput()
  }

  async #changeOriginInput() {
    const lat = this.userPosition.coords.latitude
    const long = this.userPosition.coords.longitude
    const geocodingUrl= `https://api.mapbox.com/geocoding/v5/mapbox.places/${long},${lat}.json?access_token=${this.apiKeyValue}`
    const result = await fetch(geocodingUrl)
    const json = await result.json()
    const address = json.features[0].place_name

    const input = document.querySelector("#champ .mapboxgl-ctrl-geocoder--input")
    input.value = address

    const input2 = document.querySelector("#itinerary_departure")
    input2.value = address
  }

  #addOriginMarker() {
    const customMarker = document.createElement("div")
    customMarker.className = "marker marker-custom"
    customMarker.style.backgroundImage = `url('${this.departureValue}')`
    customMarker.style.backgroundSize = "cover"
    customMarker.style.width = "28px"
    customMarker.style.height = "36px"

    new mapboxgl.Marker(customMarker)
      .setLngLat([this.userPosition.coords.longitude, this.userPosition.coords.latitude])
      .addTo(this.map)

    this.#fitMapToMarkers(location)
  }

  #addMarkersToMap() {
    // if (!this.hasMarkerValue) return
    this.warningsValue.forEach((warning) => {
      const customMarker = document.createElement("div")
      customMarker.className = "marker marker-custom"
      customMarker.style.backgroundImage = `url('${warning.image}')`
      customMarker.style.backgroundSize = "cover"
      customMarker.style.width = "64px"
      customMarker.style.height = "64px"

      new mapboxgl.Marker(customMarker)
        .setLngLat([warning.lng, warning.lat])
        .addTo(this.map)
    })

    this.markersValue.forEach((marker) => {
      const customMarker = document.createElement("div")
      customMarker.className = "marker marker-custom"
      customMarker.style.backgroundImage = `url('${marker.image}')`
      customMarker.style.backgroundSize = "cover"
      customMarker.style.height = "36px"
      customMarker.style.width = "28px"

      new mapboxgl.Marker(customMarker)
        .setLngLat([marker.lng, marker.lat])
        .addTo(this.map)
    })
  }

  #fitMapToMarkers() {
    const bounds = new mapboxgl.LngLatBounds()

    if (this.hasBoundsValue) {
      bounds.extend(this.boundsValue)
    }

    if (this.userPosition) {
      console.log(this.userPosition)
      bounds.extend([this.userPosition.coords.longitude, this.userPosition.coords.latitude])
    }

    this.map.fitBounds(bounds, { padding: 40, maxZoom: 15, duration: 0 })
  }

  #addSections() {
    let sectionCoordinates = []

    this.routesValue.forEach((route) => {
      route.forEach((section) => {
        let coordinatesFromPolyline = polyline.decode(section.geometry).map((a) => { return a.reverse() })

        const colors = {
          yellow: '#F9B54F',
          red: '#F3574A',
          green: '#5ABFAD'
        }

        let color
        if (section.weight >= 100) {
          color = colors.red
        } else if (section.weight >= 50) {
          color = colors.yellow
        } else {
          color = colors.green
        }

        sectionCoordinates.push({
          id: Math.random().toString(16).slice(2),
          coordinates: coordinatesFromPolyline,
          color: color
        })
      })

      this.map.on('load', () => {
        sectionCoordinates.forEach((sectionCoordinate) => {
          this.map.addSource(`route-${sectionCoordinate.id}`, {
            'type': 'geojson',
            'data': {
              'type': 'Feature',
              'properties': {},
              'geometry': {
                'type': 'LineString',
                'coordinates': sectionCoordinate.coordinates
              }
            }
          });

          this.map.addLayer({
            'id': `route-${sectionCoordinate.id}`,
            'type': 'line',
            'source': `route-${sectionCoordinate.id}`,
            'layout': {
              'line-join': 'round',
              'line-cap': 'round'
            },
            'paint': {
              'line-color': sectionCoordinate.color,
              'line-width': 8
            }
          });
        })
      })
    })
  }
}
