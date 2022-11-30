class Route < ApplicationRecord
  belongs_to :itinerary
  has_many :route_sections
  has_many :sections, through: :route_sections
end
