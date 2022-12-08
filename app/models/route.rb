class Route < ApplicationRecord
  # after_validation :geocode, if: :will_save_change_to_address?
  geocoded_by :address
  belongs_to :itinerary
  has_many :route_sections
  has_many :sections, through: :route_sections
  has_many :section_warnings, through: :sections

  def warnings
    warnings = section_warnings.map do |warning|
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
end
