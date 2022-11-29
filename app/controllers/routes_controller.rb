class RoutesController < ApplicationController
  def new
    @routes = Route.new
  end

  def create
  end

  def show
    @routes = Route.find(params[:id])
  end

  def rate
  end
end
