class ToolsController < ApplicationController
  def new
    @recipe = Recipe.find(params[:recipe_id])
    @tool = @recipe.tools.new
  end

  def create
    @recipe = Recipe.find(params[:recipe_id])
    @tool = @recipe.tools.new(tool_params)
    if @tool.save
      @recipe.tools << @tool
      redirect_to @recipe
    else
      render 'new'
    end
  end

  private

  def tool_params
    params.require(:tool).permit(:name)
  end
end
