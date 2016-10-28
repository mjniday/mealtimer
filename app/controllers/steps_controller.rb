class StepsController < ApplicationController
  def new
    @recipe = Recipe.find(params[:recipe_id])
    @step = @recipe.steps.new
  end

  def create
    @recipe = Recipe.find(params[:recipe_id])
    @step = @recipe.steps.new(step_params)
    if @step.save
      redirect_to @recipe
    else
      render 'new'
    end
  end

  private

  def step_params
    params.require(:step).permit(:description)
  end
end
