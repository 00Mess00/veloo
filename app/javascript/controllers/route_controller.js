import { Controller } from "@hotwired/stimulus"
import polyline from "@mapbox/polyline"
import { end } from "@popperjs/core"

// Connects to data-controller="map"
export default class extends Controller {
  static values = {
    apiKey: String,
    route: Object,
    bounds: Array,
    position: Array,
    left: String,
    right: String,
    straight: String
  }

  static targets = ["instruction", "nextInstruction", "distance", "image", "map"]

  connect() {
    // navigator.geolocation.getCurrentPosition = function(successCallback, errorCallback) {
    //   successCallback({coords:{latitude:48.104358015568515, longitude:-1.6639229317600917}});
    // }
    mapboxgl.accessToken = this.apiKeyValue
    this.map = new mapboxgl.Map({
      container: this.mapTarget,
      style: "mapbox://styles/mapbox/streets-v10",
      center: [this.routeValue.sections[0].from_lng, this.routeValue.sections[0].from_lat],
      zoom: 20,
      pitch: 60,
      bearing: turf.bearing(
        turf.point([this.routeValue.sections[0].from_lng, this.routeValue.sections[0].from_lat]),
        turf.point([this.routeValue.sections[0].to_lng, this.routeValue.sections[0].to_lat])
      ),
    })
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

    // const bounds = new mapboxgl.LngLatBounds()
    // bounds.extend(this.boundsValue)
    // this.map.fitBounds(bounds, { padding: 70, maxZoom: 15, duration: 0 })

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

    // Pour chaque section de la route
    this.routeValue.sections.forEach((section) => {
      // Je transforme la polyline en Array de coordonnées avec un module mapbox
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
            'line-width': 8
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

      // Update point geometry to a new position based on this.counter denoting
      // the index to access the arc
      this.point.features[0].geometry.coordinates =
        this.arc[this.counter];

      // Calculate the bearing to ensure the icon is rotated to match the route arc
      // The bearing is calculated between the current this.point and the next this.point, except
      // at the end of the arc, which uses the previous this.point and the current this.point
      this.point.features[0].properties.bearing = turf.bearing(
        turf.point(start),
        turf.point(end)
      );
      // this.map.setBearing(turf.bearing(
      //   turf.point(start),
      //   turf.point(end)
      // ))
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

      // Update the source with this new data
      this.map.getSource('point').setData(this.point);

      // Request the next frame of animation as long as the end has not been reached
      if (this.counter < this.steps) {
        // setTimeout(() =>{
        // }, 2000)
        requestAnimationFrame(animate);
      }

      this.counter = this.counter + 1;
    }
  }


  addSpecificMarkersToMap(lat, lng, img) {
    // Create a HTML element for your custom marker
    const customMarker = document.createElement("div")
    customMarker.className = "marker"
    customMarker.style.backgroundImage = `url('${img}')`
    customMarker.style.backgroundSize = "contain"
    customMarker.style.width = "53px"
    customMarker.style.height = "64px"

    new mapboxgl.Marker(customMarker)
      .setLngLat([ lng, lat ])
      .addTo(this.map)
  }
}
