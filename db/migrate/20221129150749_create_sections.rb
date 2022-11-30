class CreateSections < ActiveRecord::Migration[7.0]
  def change
    create_table :sections do |t|
      t.float :cyclability
      t.string :from
      t.string :float
      t.float :to
      t.references :route, null: false, foreign_key: true

      t.timestamps
    end
  end
end
