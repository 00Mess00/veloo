import { Controller } from "@hotwired/stimulus"
import polyline from "@mapbox/polyline"
import { end } from "@popperjs/core"
var Interval = require('math.interval')

// Connects to data-controller="map"
export default class extends Controller {
  static values = {
    apiKey: String,
    route: Object,
    bounds: Array,
    position: Array,
    left: String,
    right: String,
    straight: String,
    url: String,
    type: String,
    img: String,
    warnings: Array
  }

  static targets = ["instruction", "nextInstruction", "distance", "image", "map"]

  connect() {
    // navigator.geolocation.getCurrentPosition = function(successCallback, errorCallback) {
    //   successCallback({coords:{latitude:48.104358015568515, longitude:-1.6639229317600917}});
    // }
    mapboxgl.accessToken = this.apiKeyValue
    this.map = new mapboxgl.Map({
      container: this.mapTarget,
      style: "mapbox://styles/hugsdanielwags/clbf0lrwz004n14o0rhtsjr59",
      center: [this.routeValue.sections[0].from_lng, this.routeValue.sections[0].from_lat],
      zoom: 19,
      pitch: 60,
      bearing: turf.bearing(
        turf.point([this.routeValue.sections[0].from_lng, this.routeValue.sections[0].from_lat]),
        turf.point([this.routeValue.sections[0].to_lng, this.routeValue.sections[0].to_lat])
      ),
    })
    this.#addMarkersToMap()
    this.map.setPadding({top: 500})

    this.routeCoordinates = polyline.decode(this.routeValue.geometry).map((a) => { return a.reverse() })
    this.point = {
      'type': 'FeatureCollection',
      'features': [
        {
          'type': 'Feature',
          'properties': {},
          'geometry': {
            'type': 'Point',
            'coordinates': [this.routeValue.sections[0].from_lng, this.routeValue.sections[0].from_lat]
          }
        }
      ]
    };
    this.counter = 0;
    this.steps = 10000;

    const line = turf.lineString(this.routeCoordinates);
    const lineDistance = turf.length(line);
    this.arc = [];
    for (let i = 0; i < lineDistance; i += lineDistance / this.steps) {
      const segment = turf.along(line, i);
      this.arc.push(segment.geometry.coordinates);
    }
    let sectionCoordinates = []

    this.instructionTarget.innerText = this.routeValue.sections[0].name
    this.nextInstructionTarget.innerText = this.routeValue.sections[1].name
    this.distanceTarget.innerText = this.routeValue.sections[0].distance

    if (this.routeValue.sections[0].instruction == "sharp right" || this.routeValue.sections[0].instruction == "right" || this.routeValue.sections[0].instruction == "slight right" ) {
      this.imageTarget.src = this.rightValue
    }
    if (this.routeValue.sections[0].instruction == "straight" || this.routeValue.sections[0].instruction === null) {
      console.log(this.straightValue)
      this.imageTarget.src = this.straightValue
    }
    if (this.routeValue.sections[0].instruction == "sharp left" || this.routeValue.sections[0].instruction == "left" || this.routeValue.sections[0].instruction == "slight left" ) {
      this.imageTarget.src = this.leftValue
    }

    this.routeValue.sections.forEach((section) => {
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

      console.log(section)
      sectionCoordinates.push({
        id: section.id,
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
              'coordinates': sectionCoordinate.coordinates         // Source qui contient les coordonnées de la section
            }
          }
        });

        this.map.addLayer({
          'id': `route-${sectionCoordinate.id}`,
          'type': 'line',
          'source': `route-${sectionCoordinate.id}`,           // source que j'ai créée juste au dessus
          'layout': {
            'line-join': 'round',
            'line-cap': 'round'
          },
          'paint': {
            'line-color': sectionCoordinate.color,
            'line-width': 20
          }
        });
      })
      this.map.loadImage(
        'https://docs.mapbox.com/mapbox-gl-js/assets/cat.png',
        (error, image) => {
          if (error) throw error;

          // Add the image to the map style.
          this.map.addImage('cat', image);

          this.map.addSource('point', {
            'type': 'geojson',
            'data': this.point
          });

          this.map.addLayer({
            'id': 'point',
            'source': 'point',
            'type': 'symbol',
            'layout': {
              'icon-image': '',
              'icon-size': 0.1,
              'icon-rotate': ['get', 'bearing'],
              'icon-rotation-alignment': 'map',
              'icon-allow-overlap': true,
              'icon-ignore-placement': true
            }
          });
          animate(this.counter);
        }
      )
    })

    const animate = () => {
      const start =
        this.arc[
          this.counter >= this.steps ? this.counter - 1 : this.counter
        ];
      const end =
        this.arc[
          this.counter >= this.steps ? this.counter : this.counter + 1
        ];
      if (!start || !end) return;

      this.point.features[0].geometry.coordinates = this.arc[this.counter];

      this.point.features[0].properties.bearing = turf.bearing(
        turf.point(start),
        turf.point(end)
      );
      let turfBearing = turf.bearing(
        turf.point(start),
        turf.point(end)
      )

      this.map.setCenter(this.point.features[0].geometry.coordinates)
      this.map.easeTo({
        bearing: turfBearing,
        duration: 100,
        easing(t) {
          return t;
        }
      });

      this.map.getSource('point').setData(this.point);

      if (this.counter < this.steps) {
        requestAnimationFrame(animate);
      }

      this.counter = this.counter + 1;
    }
  }

  #addMarkersToMap() {
    this.warningsValue.forEach((warning) => {
      const customMarker = document.createElement("div")
      customMarker.className = "marker"
      customMarker.style.backgroundImage = `url('${warning.image}')`
      customMarker.style.backgroundSize = "cover"
      customMarker.style.width = "40px"
      customMarker.style.height = "40px"

      new mapboxgl.Marker(customMarker)
        .setLngLat([warning.lng, warning.lat])
        .addTo(this.map)
    })
  }

  addSpecificMarkersToMap(lat, lng, img) {
    const customMarker = document.createElement("div")
    customMarker.className = `new-marker`
    customMarker.style.backgroundImage = `url('${img}')`
    customMarker.style.backgroundSize = "contain"
    customMarker.style.width = `37px`
    customMarker.style.height = `48px`

    new mapboxgl.Marker(customMarker)
      .setLngLat([ lng, lat ])
      .addTo(this.map)
  }

  async addRate(event) {
    const map = document.getElementById("route-map")
    const sections = this.routeValue.sections
    let id = 0

    const navigatorPos = this.point.features[0].geometry.coordinates

    sections.forEach((section) => {
      const geom = section.geometry
      const geomDecod = polyline.decode(geom)

      const minLat = Math.min(...geomDecod.map(coordinates => coordinates[0]))
      const maxLat = Math.max(...geomDecod.map(coordinates => coordinates[0]))
      const minLong = Math.min(...geomDecod.map(coordinates => coordinates[1]))
      const maxLong = Math.max(...geomDecod.map(coordinates => coordinates[1]))

      let intervalLat = new Interval(`(${minLat}, ${maxLat})`)
      let intervalLong = new Interval(`(${minLong}, ${maxLong})`)
      if (intervalLat.contains(navigatorPos[1]) && intervalLong.contains(navigatorPos[0])) {
        id = section.id
        const formData = new FormData()
        formData.append("type", event.currentTarget.dataset.routeTypeValue)

        fetch(`/sections/${id}/rate`, {
          method: "PATCH",
          headers: {
            "Accept": "application/json",
            "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').getAttribute('content')},
          body: formData
        }).then(response => response.json())
        .then((data) => {
          const colors = {
            yellow: '#F9B54F',
            red: '#F3574A',
            green: '#5ABFAD'
          }

          let color
          if (data.weight >= 100) {
            color = colors.red
          } else if (data.weight >= 50) {
            color = colors.yellow
          } else {
            color = colors.green
          }
          this.map.setPaintProperty(`route-${data.id}`, 'line-color', color)
        })
      }
    })
  }

  async addWarning(event) {
    const map = document.getElementById("route-map")
    const sections = this.routeValue.sections
    let id = 0
    const navigatorPos = this.point.features[0].geometry.coordinates

    sections.forEach((section) => {
      const geom = section.geometry
      const geomDecod = polyline.decode(geom)

      const minLat = Math.min(...geomDecod.map(coordinates => coordinates[0]))
      const maxLat = Math.max(...geomDecod.map(coordinates => coordinates[0]))
      const minLong = Math.min(...geomDecod.map(coordinates => coordinates[1]))
      const maxLong = Math.max(...geomDecod.map(coordinates => coordinates[1]))

      let intervalLat = new Interval(`(${minLat}, ${maxLat})`)
      let intervalLong = new Interval(`(${minLong}, ${maxLong})`)

      if (intervalLat.contains(navigatorPos[1]) && intervalLong.contains(navigatorPos[0])) {
        id = section.id
        const formData = new FormData()
        formData.append("type", event.currentTarget.dataset.routeTypeValue)
        formData.append("latitude", navigatorPos[1])
        formData.append("longitude", navigatorPos[0])

        fetch(`/sections/${id}/section_warnings`, {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').getAttribute('content')
          },
          body: formData
        })

      }
      this.addSpecificMarkersToMap(navigatorPos[1], navigatorPos[0], event.currentTarget.dataset.routeImgValue)
    })
  }
}
