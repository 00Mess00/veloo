class BookmarksController < ApplicationController
  def new
    @bookmark = Bookmark.new
  end

  def create
  end

  def index
    Bookmark.all
  end
end
