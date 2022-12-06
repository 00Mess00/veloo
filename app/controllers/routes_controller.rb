class RoutesController < ApplicationController
  def show
    @route = Route.find(params[:id])
  end

  def rate
  end

  def arrival
  end

end
