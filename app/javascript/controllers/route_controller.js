import { Controller } from "@hotwired/stimulus"
import polyline from "@mapbox/polyline"

// Connects to data-controller="map"
export default class extends Controller {
  static values = {
    apiKey: String,
    routes: Array,
    bounds: Array,
    markers: Array
  }

  static targets = ["instruction", "nextInstruction"]

  connect() {
    navigator.geolocation.getCurrentPosition = function(successCallback, errorCallback) {
      successCallback({coords:{latitude:48.104358015568515, longitude:-1.6639229317600917}});
    }
    this.element.controller = this
    mapboxgl.accessToken = this.apiKeyValue
    const mapContainer = document.getElementById("map")
    this.map = new mapboxgl.Map({
      container: mapContainer,
      style: "mapbox://styles/mapbox/streets-v10"
    })

    const bounds = new mapboxgl.LngLatBounds()
    bounds.extend(this.boundsValue)
    this.map.fitBounds(bounds, { padding: 70, maxZoom: 15, duration: 0 })

    // Alors en gros tout le merdier qui suit c'est pour afficher un itinéraire sur la map
    // Pour ça faut :
    //  - récupérer la fameuse geometry de la route (donc chaque geometry de chaque section)
    //  - pour chaque geometry, faut la transformer en points GPS (lat et lng)
    //  - ajouter une source à la map : https://docs.mapbox.com/mapbox-gl-js/api/sources/
    //  - ajouter une layer qui affiche la source : https://docs.mapbox.com/mapbox-gl-js/api/map/#map#addlayer
    //    En gros la layer elle prend une source et l'affiche en surcouche de la map (d'où le nom de layer)
    //    La layer elle prend un attribut 'line-color', qui va nous servir à afficher la cyclabilité de la section en question

    // Donc, étape par étape :
    let sectionCoordinates = []

    // Chaque route est passée dans l'array this.routesValue (voir app/views/itineraries/show.html.erb:12)
    // plus ou moins ce format là : un array général, un sous array par route, un hash par section dans chaque route
    // [
    //   [
    //     {id: 1, name: "Rue de Léon", geometry: "àzda0ddzé&&àsm", ...}
    //     {id: 2, name: "Rue Dupont des Loges", geometry: "_zddz$%s_m", ...}
    //   ],
    //   [
    //     {id: 3, name: "Rue de Tonton", geometry: "àzda0ddzé&&àsm", ...}
    //     {id: 4, name: "Rue Dupont des Chouettes", geometry: "_zddz$%s_m", ...}
    //   ]
    // ]

    // Donc pour chaque route
    this.routesValue.forEach((route) => {
      //console.log(route)
      this.instructionTarget.innerText = route[0].name
      this.nextInstructionTarget.innerText = route[1].name
      //this.instructionTargets.innerText;

      // Pour chaque section de la route
      route.forEach((section) => {
        // Je transforme la polyline en Array de coordonnées avec un module mapbox
        let coordinatesFromPolyline = polyline.decode(section.geometry).map((a) => { return a.reverse() })

        // Dans l'array je push un objet qui contient
        // un ID unique pour la section (nécéssaire pour plus bas) et les coordonnées
        sectionCoordinates.push({ id: Math.random().toString(16).slice(2), coordinates: coordinatesFromPolyline })
      })

      // console.log(sectionCoordinates)

      // À ce niveau là, sectionCoordinates contient un Array d'objets
      // En gros vous verrez que ça ressemble à ça :
      // [
      //   {
      //     id: 2090293029,
      //     coordinates : [
      //       [ -1.67031, 48.10848 ]
      //       [ -1.67095, 48.10867 ]
      //       [ -1.67105, 48.1087 ]
      //       ...
      //     ]
      //   },
      //   ...
      // ]
      // Où le gros Array principal contient un objet pour chaque section
      // objet qui contient une clé id et une clé coordinates avec chaque point GPS de la section


      // Au chargement de la map
      this.map.on('load', () => {

        // Pour chaque section
        sectionCoordinates.forEach((sectionCoordinate) => {
          const colors = ['#00FFFF', '#FF0000', '#FFFF00', '#000000']

          // Je crée une source avec un nom unique
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

          // J'ajoute une layer à la map avec la source créée plus haut
          this.map.addLayer({
            'id': `route-${sectionCoordinate.id}`,
            'type': 'line',
            'source': `route-${sectionCoordinate.id}`,           // source que j'ai créée juste au dessus
            'layout': {
              'line-join': 'round',
              'line-cap': 'round'
            },
            'paint': {
              'line-color': colors[Math.floor(Math.random()*colors.length)], // Ça c'est juste un petit hack pour avoir une couleur random, mais faudra que la couleur dépende de la cyclabilité
              'line-width': 8
            }
          });
        })
      })
    })

    // La grande question après avoir démelé tout ça c'est : pourquoi se faire chier à ce point ?
    // Mon instinct sur la question c'est que vu qu'on a une source et une layer pour chaque section
    // on peut y ajouter des events, de la data particulière (genre des couleurs) et des warnings (à base de markers)
    // OPTIONNEL MAIS COOL : Il faudrait aussi créer une layer par route qu'on pourrait afficher / cacher quand on choisit une route
    //                       mais je sais pas si c'est possible d'ajouter une layer à une layer. On peut se garder ça pour plus tard.
  }
}
