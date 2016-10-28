class CreateTools < ActiveRecord::Migration[5.0]
  def change
    create_table :tools do |t|
      t.string    :quantity
      t.string    :size
      t.string    :name

      t.timestamps
    end
  end
end
