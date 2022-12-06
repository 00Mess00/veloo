class AddCyclabilityNbToSections < ActiveRecord::Migration[7.0]
  def change
    add_column :sections, :cyclability_nb, :integer
  end
end
