const logButton = document.querySelector('.buttons-area__button_logOrder');

logButton.addEventListener('click', () => {
    const confirmed = confirm('Do you want log the order?');
    if (confirmed) {
      google.script.run
        .withSuccessHandler(() => {
          SpreadsheetApp.getActiveSpreadsheet().toast('Orders successfully logged in history');
        })
        .withFailureHandler((error) => {
          SpreadsheetApp.getActiveSpreadsheet().toast(`Error: ${error}`);
        })
        .logOrderHistory();
    }
  });