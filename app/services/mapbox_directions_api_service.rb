require "open-uri"
require "json"

class MapboxDirectionsApiService
  def initialize(departure:, arrival:)
    @departure = departure
    @arrival = arrival
  end

  def call
    departure_coordinates = Geocoder.search(@departure).first.coordinates
    arrival_coordinates = Geocoder.search(@arrival).first.coordinates

    Mapbox.access_token = ENV["MAPBOX_API_KEY"]
    drivingDirections = Mapbox::Directions.directions([{
        longitude: departure_coordinates.last,
        latitude: departure_coordinates.first
      }, {
        longitude: arrival_coordinates.last,
        latitude: arrival_coordinates.first
      }],
      "cycling",
      {
        geometries: "polyline",
        alternatives: true,
        continue_straight: true,
        annotations: "distance,duration",
        language: "fr",
        overview: "full",
        steps: true
      })

    p drivingDirections
  end
end
