require 'html-proofer'  # https://github.com/gjtorikian/html-proofer/

task default: %w[test]

task :test do
  sh "bundle exec jekyll build"
  options = { :assume_extension => true }
  HTMLProofer.check_directory("./_site", options).run
end
