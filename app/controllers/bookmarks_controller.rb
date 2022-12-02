class BookmarksController < ApplicationController
  def index
    @bookmarks = Bookmark.all
  end
  def new
    @bookmark = Bookmark.new
  end

  def create
    @bookmark = Bookmark.new(bookmark_params)
    @bookmark.save
  end
end


private

def bookmark_params
  params.require(:bookmark).permit(:name, :address)
end
