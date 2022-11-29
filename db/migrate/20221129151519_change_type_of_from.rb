class ChangeTypeOfFrom < ActiveRecord::Migration[7.0]
  def change
    add_column :sections, :from_lat, :float
    add_column :sections, :from_lng, :float
    add_column :sections, :to_lat, :float
    rename_column :sections, :to, :to_lng
    add_column :sections, :geometry, :string
  end
end
