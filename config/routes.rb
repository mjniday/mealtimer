Rails.application.routes.draw do

  # devise_for :users
  root to: 'recipes#index'
  resources :recipes do
    resources :steps
    resources :ingredients
    resources :tools
  end
end
