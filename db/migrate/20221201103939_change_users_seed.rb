class ChangeUsersSeed < ActiveRecord::Migration[7.0]
  def change
    remove_column :users, :first_name
    remove_column :users, :last_name
    remove_column :users, :nick_name
    remove_column :users, :address
    add_column :users, :average_speed, :float
  end
end
