require "open-uri"
require "json"

class MapboxDirectionsApiService
  def initialize(departure:, arrival:)
    @departure = departure
    @arrival = arrival
  end

  def call
    departure_coordinates = Geocoder.search(@departure).first.coordinates.reverse.join(",")
    arrival_coordinates = Geocoder.search(@arrival).first.coordinates.reverse.join(",")

    coordinates = [departure_coordinates, arrival_coordinates].join(";")

    response = URI.open("https://api.mapbox.com/directions/v5/mapbox/cycling/#{coordinates}?alternatives=true&continue_straight=true&geometries=polyline&annotations=distance,duration&language=fr&overview=full&steps=true&access_token=#{ENV['MAPBOX_API_KEY']}").read
    data = JSON.parse(response)

    p data
  end
end
