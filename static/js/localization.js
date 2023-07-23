
window.addEventListener("load", function () {
  var i18nOpts = {
    getAsync: true,
    fallbackLng: 'en',
    backend: {
      loadPath: 'locales/{{lng}}.json'
    }
  };

  var translate = function() {
    $('.i18container').localize();
    $('#i18_navbar').localize();
    $('#i18_about_me').localize();
    $('#i18_skills').localize();
    $('#i18_projects').localize();
    $('#i18_career').localize();
    $('#i18_bibliography').localize();
    // $('#i18_blog').localize();
    $('#i18_link').localize();
  };

  $("[id^=set_lang]").each(function() {
    var $this = $(this);
    $this.on('click', function() {
      i18next.changeLanguage($this.data('locale'), translate);
    });
  });

  i18next
    .use(i18nextHttpBackend)
    .init(i18nOpts, translate);
  jqueryI18next.init(i18next, $, { useOptionsAttr: true })
});
