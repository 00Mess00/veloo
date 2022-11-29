class DestroyFrom < ActiveRecord::Migration[7.0]
  def change
    remove_column :sections, :from
    remove_column :sections, :float
  end
end
