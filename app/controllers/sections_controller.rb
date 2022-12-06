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
        section.cyclability = 10
      else
        section.cyclability = ((section.cyclability * section.cyclability_nb) + 10) / (section.cyclability_nb + 1)
      end
    end
    if params[:type] == "middle"
      if section.cyclability_nb.to_i.zero?
        section.cyclability_nb = 0
        section.cyclability = 5
      else
        section.cyclability = ((section.cyclability * section.cyclability_nb) + 5) / (section.cyclability_nb + 1)
      end
    end
    if params[:type] == "bad"
      if section.cyclability_nb.to_i.zero?
        section.cyclability_nb = 0
        section.cyclability = 0
      else
        section.cyclability = (section.cyclability * section.cyclability_nb) / (section.cyclability_nb + 1)
      end
    end
    section.cyclability_nb += 1
    section.save
  end
end
