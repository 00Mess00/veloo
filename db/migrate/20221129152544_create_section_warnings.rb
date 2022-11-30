class CreateSectionWarnings < ActiveRecord::Migration[7.0]
  def change
    create_table :section_warnings do |t|
      t.string :warning_type
      t.float :lng
      t.float :lat
      t.references :section, null: false, foreign_key: true

      t.timestamps
    end
  end
end
