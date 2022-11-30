class AddInfosToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :first_name, :string
    add_column :users, :last_name, :string
    add_column :users, :nick_name, :string
    add_column :users, :address, :string
    add_column :users, :skills, :string
    add_column :users, :bike_type, :string
  end
end
