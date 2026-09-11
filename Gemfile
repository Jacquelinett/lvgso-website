source "https://rubygems.org"

# This mirrors the exact gem versions GitHub Pages uses to build your site,
# so what you see with `bundle exec jekyll serve` matches production.
gem "github-pages", group: :jekyll_plugins

group :jekyll_plugins do
  gem "jekyll-sitemap"
  gem "jekyll-seo-tag"
end

# Windows / JRuby support some environments need
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]
gem "http_parser.rb", "~> 0.6.0", :platforms => [:jruby]
