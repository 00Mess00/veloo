class RoutesController < ApplicationController
  def new
    @route = Route.new
  end

  def create
    @results = MapboxDirectionsApiService.new(
                departure: route_params[:departure],
                arrival: route_params[:arrival]).call

    @results[:routes].each do |route_data|
      route = Route.new(
        departure: route_params[:departure],
        arrival: route_params[:arrival],
        departure_lat: @results[:departure_coordinates].first,
        departure_lng: @results[:departure_coordinates].last,
        arrival_lat: @results[:arrival_coordinates].first,
        arrival_lng: @results[:arrival_coordinates].last,
        user: current_user,
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
              instruction: step["maneuver"]["instruction"],
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

  def show
    @route = Route.find(params[:id])
  end

  def rate
  end

  private

  def route_params
    params.require(:route).permit(:departure, :arrival)
  end
end
