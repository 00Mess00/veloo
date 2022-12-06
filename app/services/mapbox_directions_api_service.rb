require "open-uri"
require "json"

class MapboxDirectionsApiService
  def initialize(itinerary:)
    @itinerary = itinerary
    @departure = @itinerary.departure
    @arrival = @itinerary.arrival
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

    results = drivingDirections.first["routes"].sort_by { |route| route["weight"] }

    results.each do |route_data|
      route = Route.new(
        departure: @departure,
        arrival: @arrival,
        departure_lat: departure_coordinates.first,
        departure_lng: departure_coordinates.last,
        arrival_lat: arrival_coordinates.first,
        arrival_lng: arrival_coordinates.last,
        itinerary: @itinerary,
        weight: route_data["weight"],
        distance: route_data["distance"],    # distance en mètres
        duration: route_data["duration"]     # durée en secondes
      )

      if route.save
        steps = route_data["legs"].first["steps"]

        steps.each_with_index do |step, index|
          section = Section.find_by(geometry: step["geometry"])

          unless section
            section = Section.new(
              weight: step["weight"],
              geometry: step["geometry"],
              name: step["name"],
              instruction: step["maneuver"]["modifier"],
              from_lat: step["maneuver"]["location"].last,
              from_lng: step["maneuver"]["location"].first
           )

            # Si il n'y a pas de step suivante
            if steps[index + 1].nil?
              # La sortie de la section est l'arrivée
              section.to_lat = route.arrival_lat
              section.to_lng = route.arrival_lng
            else
              section.to_lat = steps[index + 1]["maneuver"]["location"].last
              section.to_lng = steps[index + 1]["maneuver"]["location"].first
            end

            section.save
          end

          RouteSection.create(route: route, section: section)
        end
      end
    end
  end
end
