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
      function (response) {
        response.json().then(
          (data) => data.forEach(
            (repo) => {
              if (repos.indexOf(repo.full_name) !== -1) {
                x = repo.name;
                $("div[repo='" + x + "']").children(".star").html('<i class="fas fa-star"></i> ' + repo.stargazers_count)
                $("div[repo='" + x + "']").children(".fork").html('<i class="fas fa-code-fork"></i> ' + repo.forks_count)
              }
            }
          )
        )
      }
    )
  })
});
