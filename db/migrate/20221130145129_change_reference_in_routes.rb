class ChangeReferenceInRoutes < ActiveRecord::Migration[7.0]
  def change
    remove_reference :routes, :user
    add_reference :routes, :itinerary, foreign_key: true, index: true, null: false
  end
end
