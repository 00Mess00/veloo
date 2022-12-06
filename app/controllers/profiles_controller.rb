class ProfilesController < ApplicationController
  def edit
    @user = current_user
  end

  def update
    @user = current_user
    @user.update(user_params)
    redirect_to new_itinerary_path
  end
end


private

def user_params
  params.require(:user).permit(:email, :skills, :bike_type,:photo, :average_speed, :visual_impairment)
end
