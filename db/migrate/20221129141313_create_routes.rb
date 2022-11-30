class CreateRoutes < ActiveRecord::Migration[7.0]
  def change
    create_table :routes do |t|
      t.string :departure
      t.string :arrival
      t.string :route_type
      t.boolean :active

      t.timestamps
    end
  end
end
