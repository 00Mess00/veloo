class ItinerariesController < ApplicationController
  def new
    @itinerary = Itinerary.new
  end

  def create
    @itinerary = Itinerary.new(itinerary_params)
    @itinerary.user = current_user

    if @itinerary.save
      @results = MapboxDirectionsApiService.new(itinerary: @itinerary).call

      redirect_to itinerary_path(@itinerary)
    else
      render :new, status: :unprocessable_entity
    end
  end

  def show
    @itinerary = Itinerary.find(params[:id])
  end

  def rate
  end

  private

  def itinerary_params
    params.require(:itinerary).permit(:departure, :arrival)
  end
end
