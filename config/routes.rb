Rails.application.routes.draw do
  devise_for :users
  root to: "pages#home"
  get "/arrival", to: "pages#arrival"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
  resource :profiles, only: [:edit, :update]

  resources :itineraries, only: [:new, :create, :show]
  resources :routes, only: [:show] do
    member do
      patch :rate
    end
  end

  resources :bookmarks, only: [:new, :create, :index]

  resources :section_warnings, only: [:update]

  resources :sections, only: [] do
    resources :section_warnings, only: [:new, :create]
    member do
      patch :rate
    end
  end
end
