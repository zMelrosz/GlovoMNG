const debetPanel = document.querySelector(".buttons-area__panel_deposit");
const debetSubmit = document.querySelector('.buttons-area__submit-button_debet');

const kreditPanel = document.querySelector('.buttons-area__panel_kredit');
const kreditSubmit = document.querySelector('.buttons-area__panel_kredit');

const processingButton = document.querySelector('.buttons-area__button_processing');

    debetPanel.querySelector('.buttons-area__submit-button_debet').addEventListener('click', function() { // make debet listeners
        const dropdown = debetPanel.querySelector('.buttons-area__dropdown');
        const input = debetPanel.querySelector('.buttons-area__input');
        
        const data = {
            'user' : dropdown.value,
            'amount' : input.value
        };
        google.script.run.withSuccessHandler(function() {
          google.script.host.close();
          SpreadsheetApp.getActive().toast('Deposit successful!');
      }).makeDeposit(data);
      });

      kreditPanel.querySelector('.buttons-area__submit-button_kredit').addEventListener('click', function() {
        const dropdown = debetPanel.querySelector('.buttons-area__dropdown');
        const input = kreditPanel.querySelector('.buttons-area__input');
    
        const data = {
            'user': dropdown.value,
            'amount': input.value
        }; 
    
        google.script.run.withSuccessHandler(function() {
            google.script.host.close();
            SpreadsheetApp.getActive().toast('Credit successful!');
        }).makeCredit(data);
    });

      processingButton.addEventListener('click', function() {

        if (confirm('Process orders?')) {
            processingButton.disabled = true;
            processingButton.classList.add('buttons-area__button_processing--active');
        
            google.script.run
              .withSuccessHandler(function() {
                processingButton.disabled = false;
                processingButton.classList.remove('buttons-area__button_processing--active');
                google.script.host.close();
              })
              .withFailureHandler(function(error) {
                processingButton.disabled = false;
                processingButton.classList.remove('buttons-area__button_processing--active');
                console.log(error);
              })
              .processOrders();
          }
      });

