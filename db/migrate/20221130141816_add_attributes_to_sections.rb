class AddAttributesToSections < ActiveRecord::Migration[7.0]
  def change
    add_column :sections, :name, :string
    add_column :sections, :weight, :float
    add_column :sections, :instruction, :string
  end
end
