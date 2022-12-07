class SectionsController < ApplicationController
  def new
    @sections = Section.new
  end

  def create
  end

  def rate
    section = Section.find(params[:id])
    if params[:type] == "good"
      if section.cyclability_nb.to_i.zero?
        section.cyclability_nb = 0
        section.weight = 10
      else
        section.weight = ((section.weight * section.cyclability_nb) + 25) / (section.cyclability_nb + 1)
      end
    end
    if params[:type] == "middle"
      if section.cyclability_nb.to_i.zero?
        section.cyclability_nb = 0
        section.weight = 5
      else
        section.weight = ((section.weight * section.cyclability_nb) + 75) / (section.cyclability_nb + 1)
      end
    end
    if params[:type] == "bad"
      if section.cyclability_nb.to_i.zero?
        section.cyclability_nb = 0
        section.weight = 0
      else
        section.weight = ((section.weight * section.cyclability_nb) + 125) / (section.cyclability_nb + 1)
      end
    end
    section.cyclability_nb += 1
    section.save

    render json: section.to_json
  end
end
