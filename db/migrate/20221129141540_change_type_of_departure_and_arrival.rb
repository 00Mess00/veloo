class ChangeTypeOfDepartureAndArrival < ActiveRecord::Migration[7.0]
  def change
    add_column :routes, :departure_lat, :float
    add_column :routes, :departure_lng, :float
    add_column :routes, :arrival_lat, :float
    add_column :routes, :arrival_lng, :float
    add_reference :routes, :user, foreign_key: true
  end
end
