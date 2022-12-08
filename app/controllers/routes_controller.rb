class RoutesController < ApplicationController
  def show
    @route = Route.find(params[:id])
    @position = [@route.departure_lat, @route.departure_lng].reverse
    @warnings = @route.section_warnings.map do |warning|
      case warning.warning_type
      when "dog"
        image = ActionController::Base.helpers.image_url('pin_dog.png')
      when "doubleparking"
        image = ActionController::Base.helpers.image_url('pin_double_parking.png')
      when "obstacle"
        image = ActionController::Base.helpers.image_url('pin_obstacle.png')
      when "splash"
        image = ActionController::Base.helpers.image_url('pin_splash.png')
      end
      {
        warning_type: warning.warning_type,
        lat: warning.lat,
        lng: warning.lng,
        image: image
      }
    end
  end

  def rate
  end

  def arrival
  end
end
