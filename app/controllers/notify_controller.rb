class NotifyController < ApplicationController
  unloadable

  def index
    if User.current.logged?
      render :json => { issues: Issue.visible.open.where(:assigned_to_id => ([User.current.id] + User.current.group_ids)).count }
    end
  end

end