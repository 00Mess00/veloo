class Section < ApplicationRecord
  belongs_to :route
  has_many :section_warnings
end
