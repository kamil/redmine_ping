require 'redmine'
require_dependency 'redmine_ping/hooks'

Redmine::Plugin.register :redmine_ping do
  name 'Redmine Ping'
  author 'Kamil Załęski'
  description ''
  version '0.0.1'
end
