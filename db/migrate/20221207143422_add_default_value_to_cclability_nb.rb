class AddDefaultValueToCclabilityNb < ActiveRecord::Migration[7.0]
  def change
    change_column :sections, :cyclability_nb, :integer, default: 0
  end
end
