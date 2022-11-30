class ChangeReferenceInSections < ActiveRecord::Migration[7.0]
  def change
    remove_reference :sections, :route
  end
end
