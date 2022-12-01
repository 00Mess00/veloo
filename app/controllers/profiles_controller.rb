class ProfilesController < ApplicationController
  def edit
    @user = current_user
  end

  def update
    @user = current_user
    @user.update(user_params)
  end
end


private

def user_params
  params.require(:user).permit(:email, :skills, :bike_type, :average_speed)
end
