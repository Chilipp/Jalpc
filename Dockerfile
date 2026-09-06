FROM circleci/ruby:2.4.1

ADD . /site/

WORKDIR /site/

USER 0

RUN bundle install

RUN bundle exec jekyll build

EXPOSE 4000

CMD ["bundle", "exec", "jekyll", "serve"]
