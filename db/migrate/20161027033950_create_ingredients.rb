class CreateIngredients < ActiveRecord::Migration[5.0]
  def change
    create_table :ingredients do |t|
      t.integer     :quantity
      t.string      :unit
      t.string      :comment
      t.string      :name
      t.references  :recipe

      t.timestamps
    end
  end
end
