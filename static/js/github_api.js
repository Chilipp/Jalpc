window.addEventListener("load", function() {
  users = []
  repos = []
  document.querySelectorAll(".ghbtn").forEach( (elem) => {
    var user = elem.getAttribute('user');
    var repo = elem.getAttribute('repo');
    repos.push(user + '/' + repo);
      if (users.indexOf(user) === -1) {
        users.push(user)
      }
  })
  // console.log(1, users, repos)
  users.forEach((user) => {
    fetch(
      "https://api.github.com/users/" + user + "/repos?per_page=100",
      {
        headers: {
          "Content-Type": "application/json",
        }
      }
    ).then(
      function (data) {
        for  (var i = 0; i < data.length; i++) {
          if (repos.indexOf(data[i].full_name) !== -1) {
            x = data[i].name;
            $("div[repo='" + x + "']").children(".star").html('<i class="fas fa-star"></i> ' + data[i].stargazers_count)
            $("div[repo='" + x + "']").children(".fork").html('<i class="fas fa-code-fork"></i> ' + data[i].forks_count)
          }
        }
      }
    )
  })
});
