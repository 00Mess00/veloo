class AddAttributesToRoutes < ActiveRecord::Migration[7.0]
  def change
    add_column :routes, :duration, :float
    add_column :routes, :distance, :float
  end
end
