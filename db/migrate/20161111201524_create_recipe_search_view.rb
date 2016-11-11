class CreateRecipeSearchView < ActiveRecord::Migration[5.0]
  def up
    execute <<-SQL
      CREATE VIEW searches AS
        SELECT
          recipes.id as searchable_id,
          'Recipe' as searchable_type,
          ingredients.name as term
          FROM recipes
          JOIN ingredients ON recipes.id = ingredients.recipe_id
        
        UNION
        
        SELECT
          recipes.id as searchable_id,
          'Recipe' as searchable_type,
          recipes.title as term
          FROM recipes

        UNION

        SELECT
          recipes.id as searchable_id,
          'Recipe' as searchable_type,
          recipes.description as term
          FROM recipes;
    SQL
  end

  def down
    execute "DROP VIEW searches;"
  end
end
