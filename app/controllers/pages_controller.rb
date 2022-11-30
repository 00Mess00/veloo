class PagesController < ApplicationController
  skip_before_action :authenticate_user!, only: [ :home ]

  def home
    if params[:depart].present? && params[:arrival].present?
      @routes = MapboxDirectionsApiService.new(
                departure: params[:depart],
                arrival: params[:arrival]).call
    end
  end
end

  # <% @routes["routes"].sort_by { |route| -route["weight"] }.each do |route| %>
  #   <ul>
  #     <li>Cyclabilité : <%= route["weight"] %> </li>
  #     <li>
  #       <ul>
  #         Sections :
  #         <% route["legs"].first["steps"].each do |leg| %>
  #           <li>
  #             <%= leg["maneuver"]["instruction"] %> : <%= leg["geometry"] %>
  #           </li>
  #         <% end %>
  #       </ul>
  #     </li>
  #   </ul>
  # <% end %>
