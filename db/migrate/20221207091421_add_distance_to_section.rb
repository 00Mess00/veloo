class AddDistanceToSection < ActiveRecord::Migration[7.0]
  def change
    add_column :sections, :distance, :integer
  end
end
