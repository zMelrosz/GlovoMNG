const formElement = document.querySelector('.form');

    function getRatingFormDate() {
      const ratingForm = document.querySelector('.form');
      const formData = new FormData(ratingForm);

      const submitData = {
        user: formData.get('user'),
        rating: formData.get('rate'),
        date: document.querySelector('.info__value_date').textContent,
        restaurant: document.querySelector('.info__value_rest').textContent,
      };
      return submitData;
    }

    function onFailureRate(error) {
      alert(error);
    }

    function onSuccessRate() {
      alert('You have voted succesfully!');
    }

    formElement.addEventListener('submit', function (evt) {
  evt.preventDefault();
  const formDataEnt = getRatingFormDate();
  console.log(`date is ${formDataEnt.date} and user is ${formDataEnt.user}`);
  if (formDataEnt.restaurant === 'Loading...') {
        // Valid data
        alert('Try again');
        return;
  }
  // eslint-disable-next-line no-undef
  google.script.run.withFailureHandler(onFailureRate).processRatingForm(formDataEnt);
  // eslint-disable-next-line no-undef
  google.script.run.withSuccessHandler(onSuccessRate).processRatingForm(formDataEnt);
});