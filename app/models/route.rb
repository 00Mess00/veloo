class Route < ApplicationRecord
  # after_validation :geocode, if: :will_save_change_to_address?
  geocoded_by :address
  belongs_to :itinerary
  has_many :route_sections
  has_many :sections, through: :route_sections
end
