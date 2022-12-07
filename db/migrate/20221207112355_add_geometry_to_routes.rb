class AddGeometryToRoutes < ActiveRecord::Migration[7.0]
  def change
    add_column :routes, :geometry, :string
  end
end
