import { Controller } from "@hotwired/stimulus"
import polyline from "@mapbox/polyline"
var Interval = require('math.interval')

export default class extends Controller {
  static values = {
    url: String,
    type: String,
    img: String
  }

  getPosition() {
    return new Promise(function(resolve,reject) {
      navigator.geolocation.getCurrentPosition(resolve,reject)
    })
  }

  async addWarning() {
    const map = document.getElementById("route-map")
    const sections = map.controller.routesValue[0]
    let id = 0

    // on récupère les coordonnées GPS de l'utilisateur
    const navigatorPos = await this.getPosition()

    // Pour chaque section
    sections.forEach((section) => {
      // On récupère sa géométrie
      const geom = section.geometry
      // On la décode (polyline.decode)
      const geomDecod = polyline.decode(geom)

      // On prend les extrémités de ces points
      const minLat = Math.min(...geomDecod.map(coordinates => coordinates[0]))
      const maxLat = Math.max(...geomDecod.map(coordinates => coordinates[0]))
      const minLong = Math.min(...geomDecod.map(coordinates => coordinates[1]))
      const maxLong = Math.max(...geomDecod.map(coordinates => coordinates[1]))

      // On regarde si le point fait partie de la boite
      let intervalLat = new Interval(`(${minLat}, ${maxLat})`)
      let intervalLong = new Interval(`(${minLong}, ${maxLong})`)

      if (intervalLat.contains(navigatorPos.coords.latitude) && intervalLong.contains(navigatorPos.coords.longitude)) {
        // Si oui, on récupère l'id de la section et on arrete tout.
        id = section.id
      }
    })
    fetch(this.urlValue.replace("id", id), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').getAttribute('content')},
      body: JSON.stringify({"type": this.typeValue, "latitude": navigatorPos.coords.latitude, "longitude": navigatorPos.coords.longitude })
    })
    map.controller.addSpecificMarkersToMap(navigatorPos.coords.latitude, navigatorPos.coords.longitude, this.imgValue)
  }
}
