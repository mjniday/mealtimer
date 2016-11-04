class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  before_action :authenticate_user!, only: [:new, :create, :edit, :update, :destroy]
end
