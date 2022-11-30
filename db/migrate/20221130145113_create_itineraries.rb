class CreateItineraries < ActiveRecord::Migration[7.0]
  def change
    create_table :itineraries do |t|
      t.references :user, null: false, foreign_key: true
      t.string :departure
      t.string :arrival

      t.timestamps
    end
  end
end
