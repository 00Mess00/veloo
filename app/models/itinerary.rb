class Itinerary < ApplicationRecord
  belongs_to :user
  has_many :routes

  validates :departure, :arrival, presence: true

  def get_bounds
    [
      [ routes.first.departure_lng, routes.first.departure_lat ],
      [ routes.first.arrival_lng, routes.first.arrival_lat ],
    ]
  end
end
