import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="final-map"
export default class extends Controller {
  static values = {
    apiKey: String,
    marker: Object
  }

  connect() {
    mapboxgl.accessToken = this.apiKeyValue

    this.map = new mapboxgl.Map({
      container: this.element,
      style: "mapbox://styles/mapbox/streets-v10",
      center: [this.markerValue.lng, this.markerValue.lat],
      zoom: 19
    })

    const customMarker = document.createElement("div")
    customMarker.className = `marker marker-custom`
    customMarker.style.backgroundImage = `url('${this.markerValue.img}')`
    customMarker.style.backgroundSize = "contain"
    customMarker.style.width = `37px`
    customMarker.style.height = `48px`

    new mapboxgl.Marker(customMarker)
      .setLngLat([this.markerValue.lng, this.markerValue.lat])
      .addTo(this.map)
  }
}
