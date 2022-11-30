class AddWeightToRoutes < ActiveRecord::Migration[7.0]
  def change
    add_column :routes, :weight, :float
  end
end
