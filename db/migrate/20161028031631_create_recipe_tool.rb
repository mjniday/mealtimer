class CreateRecipeTool < ActiveRecord::Migration[5.0]
  def change
    create_table :recipes_tools, :id => false do |t|
      t.integer :recipe_id 
      t.integer :tool_id
    end
  end
end
