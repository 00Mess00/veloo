import { Controller } from "@hotwired/stimulus"
import polyline from "@mapbox/polyline"
var Interval = require('math.interval')

// Connects to data-controller="warnings"
export default class extends Controller {
  connect() {
    console.log("connect warnings controller")
  }

  getPosition() {
    return new Promise(function(resolve,reject) {
      navigator.geolocation.getCurrentPosition(resolve,reject)
    })
  }

  addWarning() {
    const map = document.getElementById("route-map")
    const sections = map.controller.routesValue[0]

    // Pour chaque section
    map.controller.routesValue[0].forEach(async (section) => {
      // On récupère sa géométrie
      const geom = section.geometry
      // On la décode (polyline.decode)
      const geomDecod = polyline.decode(geom)

      //console.log(geomDecod)

      // On prend la plus petite latitude de ces points
      // ................. grande.......................
      // .........................longitude.............
      const minLat = Math.min(...geomDecod.map(coordinates => coordinates[0]))
      const maxLat = Math.max(...geomDecod.map(coordinates => coordinates[0]))

      const minLong = Math.min(...geomDecod.map(coordinates => coordinates[1]))
      const maxLong = Math.max(...geomDecod.map(coordinates => coordinates[1]))

      console.log(minLat)

      // on récupère les coordonnées GPS de l'utilisateur
      const navigatorPos = await this.getPosition()

      //console.log(navigatorPos)

      // On regarde si le point fait partie de la boite
      var intervalLat = new Interval(`(${minLat}, ${maxLat})`)
      var intervalLong = new Interval(`(${minLong}, ${maxLong})`)

      console.log(intervalLat.contains(navigatorPos.coords.latitude))

    })






      // Si oui, on récupère l'id de la section et on arrete tout.

      //console.log(map.controller.routesValue)
    //console.log(map.controller.routesValue[0][0].geometry)

  }
}
