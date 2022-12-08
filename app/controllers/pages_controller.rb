class PagesController < ApplicationController
  # skip_before_action :authenticate_user!, only: [:home]

  def home
    redirect_to new_itinerary_path if current_user
  end

  def arrival
    @marker = {
      lng: params[:lng],
      lat: params[:lat],
      img: ActionController::Base.helpers.image_url('arrival_pin.svg')
    }
  end
end
