# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2022_11_30_145129) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "bookmarks", force: :cascade do |t|
    t.string "address"
    t.string "name"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_bookmarks_on_user_id"
  end

  create_table "itineraries", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "departure"
    t.string "arrival"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_itineraries_on_user_id"
  end

  create_table "route_sections", force: :cascade do |t|
    t.bigint "section_id", null: false
    t.bigint "route_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["route_id"], name: "index_route_sections_on_route_id"
    t.index ["section_id"], name: "index_route_sections_on_section_id"
  end

  create_table "routes", force: :cascade do |t|
    t.string "departure"
    t.string "arrival"
    t.string "route_type"
    t.boolean "active"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.float "departure_lat"
    t.float "departure_lng"
    t.float "arrival_lat"
    t.float "arrival_lng"
    t.float "duration"
    t.float "distance"
    t.float "weight"
    t.bigint "itinerary_id", null: false
    t.index ["itinerary_id"], name: "index_routes_on_itinerary_id"
  end

  create_table "section_warnings", force: :cascade do |t|
    t.string "warning_type"
    t.float "lng"
    t.float "lat"
    t.bigint "section_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["section_id"], name: "index_section_warnings_on_section_id"
  end

  create_table "sections", force: :cascade do |t|
    t.float "cyclability"
    t.float "to_lng"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.float "from_lat"
    t.float "from_lng"
    t.float "to_lat"
    t.string "geometry"
    t.string "name"
    t.float "weight"
    t.string "instruction"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "first_name"
    t.string "last_name"
    t.string "nick_name"
    t.string "address"
    t.string "skills"
    t.string "bike_type"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "bookmarks", "users"
  add_foreign_key "itineraries", "users"
  add_foreign_key "route_sections", "routes"
  add_foreign_key "route_sections", "sections"
  add_foreign_key "routes", "itineraries"
  add_foreign_key "section_warnings", "sections"
end
