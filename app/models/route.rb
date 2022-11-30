class Route < ApplicationRecord
  belongs_to :user
  has_many :sections

  geocoded_by :address
  # after_validation :geocode, if: :will_save_change_to_address?
end
