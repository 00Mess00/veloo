class Itinerary < ApplicationRecord
  belongs_to :user
  has_many :routes

  validates :departure, :arrival, presence: true
end
