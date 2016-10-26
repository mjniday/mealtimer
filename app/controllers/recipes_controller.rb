class RecipesController < ApplicationController
  def index
    @recipes = Recipe.all
  end

  def create
    @recipe = Recipe.new(recipe_params)
  end

  def show
    @recipe = Recipe.find(params[:id])
    @steps = @recipe.steps
  end

  private

  def recipe_params
    params.require(:recipe).permit(:title,:description,:author,:source,:bg_image,:yield,:prep_time,:cook_time,:recipe_time)
  end
end
