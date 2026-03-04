require 'html-proofer'  # https://github.com/gjtorikian/html-proofer/

task default: %w[test]

task :test do
  sh "bundle exec jekyll build"
  options = { :assume_extension => true,
              url_ignore: [/www.researchgate.net/, /p3.snf.ch/, /github.com\/.*\/.*\/network/],
              :typhoeus => {
                  :ssl_verifypeer => false,
                  :ssl_verifyhost => 0}
  }
  HTMLProofer.check_directory("./_site", options).run
end
