const userTemplate = document.querySelector('#user').content;
const usersOptions = document.querySelectorAll('.buttons-area__dropdown');

 usersOptions.forEach(function(usersOption) {
  google.script.run.withSuccessHandler(function (users) {
    users.forEach(function(user) {
      const userElement = userTemplate.querySelector('.buttons-area__option').cloneNode(true);
      userElement.textContent = user;
      usersOption.append(userElement);
    });
  }).getUsers(); 
});


