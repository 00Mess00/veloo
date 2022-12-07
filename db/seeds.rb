# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)
# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)
require 'open-uri'
require 'json'

puts "Cleaning up database..."
SectionWarning.destroy_all
RouteSection.destroy_all
Route.destroy_all
Itinerary.destroy_all
Bookmark.destroy_all
User.destroy_all
Section.destroy_all



puts "Database cleaned"

puts 'Creating 3 users...'
gaetan = User.new(
  email: "gaetan@example.com",
  password: "password",
  skills: "Débutant",
  bike_type: "Tout chemin",
  average_speed: 15.5
)
file = URI.open("https://res.cloudinary.com/dbxzydbfe/image/upload/v1669129984/BB13CBED-3EC2-49A4-B6B5-3D185549A390_x7rmdr.jpg")
gaetan.photo.attach(io: file, filename: "Gaetan.jpg", content_type: "image/jpg")
gaetan.save!

quentin = User.new(
  email: "quentin@example.com",
  password: "password",
  skills: "Expert",
  bike_type: "Cargo",
  average_speed: 22.5
)
file = URI.open("https://res.cloudinary.com/dbxzydbfe/image/upload/v1669129722/avatar_sakuoe.jpg")
quentin.photo.attach(io: file, filename: "Quentin.jpg", content_type: "image/jpg")
quentin.save!

guillaume = User.new(
  email: "guillaume@example.com",
  password: "password",
  skills: "Avancé",
  bike_type: "Classique",
  average_speed: 20.5
)
file = URI.open("https://res.cloudinary.com/wagon/image/upload/c_fill,g_face,h_200,w_200/v1665432330/jjmpgh36k9njifsmq2ak.jpg")
guillaume.photo.attach(io: file, filename: "Guillaume.jpg", content_type: "image/jpg")
guillaume.save!

puts "Users created"

puts 'Creating 3 fake bookmarks...'

bookmark_1 = Bookmark.new(
  address: "2 Rue de la Mabilais, 35000 Rennes",
  name: "Le Mabilay",
  user: gaetan
)
bookmark_1.save!

bookmark_2 = Bookmark.new(
  address: "2 Place Marie Pape Carpantier, 35000 Rennes",
  name: "Ecole",
  user: guillaume
)
bookmark_2.save!

bookmark_3 = Bookmark.new(
  address: "13B Rue le Bastard, 35000 Rennes",
  name: "Le petit vapoteur",
  user: quentin
)
bookmark_3.save!
puts 'Bookmarks created'
