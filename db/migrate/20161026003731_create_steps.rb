class CreateSteps < ActiveRecord::Migration[5.0]
  def change
    create_table :steps do |t|
      t.integer     :ordinal
      t.integer     :time
      t.text        :description
      t.references  :recipe

      t.timestamps
    end
  end
end
