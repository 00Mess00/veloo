class PagesController < ApplicationController
  # skip_before_action :authenticate_user!, only: [:home]

  def home
    redirect_to new_itinerary_path if current_user
  end

  def arrival
  end
end
