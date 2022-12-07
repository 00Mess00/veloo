class RoutesController < ApplicationController
  def show
    @route = Route.find(params[:id])
    @position = [@route.departure_lat, @route.departure_lng].reverse
  end

  def rate
  end

  def arrival
  end
end
