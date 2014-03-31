require 'redmine'
require_dependency 'redmine_ping/hooks'

Redmine::Plugin.register :redmine_ping do
  name 'Redmine Ping'
  author 'Kamil Załęski'
  author_url 'https://kamilzaleski.com/'
  description ''
  version '0.0.1'
  url 'https://github.com/kamil/redmine_ping'
end
