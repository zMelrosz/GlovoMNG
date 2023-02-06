const dateVar = document.querySelector('.info__value_date');

    function putDate(date) {
      dateVar.textContent = date;
    }
    google.script.run.withSuccessHandler(putDate).getDate(); //eslint-disable-line