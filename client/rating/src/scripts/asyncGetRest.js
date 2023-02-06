const restVar = document.querySelector('.info__value_rest');

    function putRest(rest) {
      restVar.textContent = rest;
    }
    google.script.run.withSuccessHandler(putRest).getLastRestaurant(); //eslint-disable-line