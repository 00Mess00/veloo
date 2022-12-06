class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  has_many :bookmarks
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  validates :photo, presence: true

  SKILLS = ["Débutant", "intermédiaire", "Expert"]

  has_one_attached :photo
end
