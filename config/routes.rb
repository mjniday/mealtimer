Rails.application.routes.draw do

  root to: 'recipes#index'
  resources :recipes do
    resources :steps
    resources :ingredients
    resources :tools
  end
end
