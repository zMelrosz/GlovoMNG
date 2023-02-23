const depositButton = document.querySelector('.buttons-area__button_deposit');
const depositPanel = document.querySelector(".buttons-area__panel_deposit");
const kreditButton = document.querySelector(".buttons-area__button_kredit");
const kreditPanel = document.querySelector(".buttons-area__panel_kredit");

  depositButton.addEventListener("click", function () { // show deposit menu
    if (depositPanel.style.display === "none") {
      depositPanel.style.display = "block";
    } else {
      depositPanel.style.display = "none";
    }
  });

  kreditButton.addEventListener("click", function () { // show kredit menu
    if (kreditPanel.style.display === "none") {
      kreditPanel.style.display = "block";
    } else {
      kreditPanel.style.display = "none";
    }
  });