class ItinerariesController < ApplicationController
  def new
    @itinerary = Itinerary.new
  end

  def create
    @itinerary = Itinerary.new(itinerary_params)
    @itinerary.user = current_user

    if @itinerary.save!
      @results = MapboxDirectionsApiService.new(itinerary: @itinerary).call

      redirect_to itinerary_path(@itinerary)
    else
      render :new, status: :unprocessable_entity
    end
  end

  def show
    @itinerary = Itinerary.find(params[:id])
    @markers = @itinerary.routes.first(2).map do |route|
      [
        {
          lat: route.departure_lat,
          lng: route.departure_lng,
          image: ActionController::Base.helpers.image_url('departure_pin.svg')
        },
        {
          lat: route.arrival_lat,
          lng: route.arrival_lng,
          image: ActionController::Base.helpers.image_url('arrival_pin.svg')
        }
      ]
    end.flatten
  end

  def rate
  end

  private

  def itinerary_params
    params.require(:itinerary).permit(:departure, :arrival)
  end
end
