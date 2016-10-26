class CreateRecipes < ActiveRecord::Migration[5.0]
  def change
    create_table :recipes do |t|
      t.string  :title
      t.text    :description
      t.string  :author
      t.string  :source
      t.string  :bg_image
      t.string  :yield
      t.text    :cook_time

      t.timestamps
    end
  end
end
