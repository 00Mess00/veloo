class PagesController < ApplicationController
  skip_before_action :authenticate_user!, only: [ :home ]

  def home
    if params[:depart].present? && params[:arrival].present?
      @routes = MapboxDirectionsApiService.new(
                departure: params[:depart],
                arrival: params[:arrival]).call
    end
  end
end
