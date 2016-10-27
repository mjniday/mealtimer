class RecipesController < ApplicationController
  def index
    @recipes = Recipe.all
  end

  def new
    @recipe = Recipe.new
  end

  def create
    @recipe = Recipe.new(recipe_params)
    if @recipe.save
      redirect_to @recipe
    else
      render 'new'
    end
  end

  def show
    @recipe = Recipe.find(params[:id])
    @ingredients = @recipe.ingredients
    @steps = @recipe.steps
  end

  private

  def recipe_params
    params.require(:recipe).permit(:title,:description,:author,:source,:bg_image,:yield,:prep_time,:cook_time,:recipe_time)
  end
end
