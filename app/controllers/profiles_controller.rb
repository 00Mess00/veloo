class ProfilesController < ApplicationController
  def edit
    @user = current_user
  end
end


simple_form_for @user
