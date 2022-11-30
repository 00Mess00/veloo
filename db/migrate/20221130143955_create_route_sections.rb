class CreateRouteSections < ActiveRecord::Migration[7.0]
  def change
    create_table :route_sections do |t|
      t.references :section, null: false, foreign_key: true
      t.references :route, null: false, foreign_key: true

      t.timestamps
    end
  end
end
