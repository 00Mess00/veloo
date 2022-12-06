class SectionWarningsController < ApplicationController
  def update
  end

  def create
    section = Section.find(params[:section_id])
    new_warning = SectionWarning.new
    new_warning.warning_type = params[:type]
    new_warning.lat = params[:latitude]
    new_warning.lng = params[:longitude]
    new_warning.section = section
    new_warning.save
  end

end
