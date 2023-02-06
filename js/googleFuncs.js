/* eslint-disable guard-for-in */
// ---------------------------------------------------------google functions--------------------------------------------------------------
function doGet() {
    return HtmlService.createHtmlOutputFromFile('webApp/indexHTML');
  }
  
  function onOpen() {
    SpreadsheetApp.getUi().createMenu('Оценить заказ').addItem('Открыть', 'openDialog').addToUi();
  }
  
  function openDialog() {
    const html = HtmlService.createHtmlOutputFromFile('webApp/indexHTML').setWidth(500).setHeight(1000);
  
    SpreadsheetApp.getUi().showModalDialog(html, 'Оценить заказ');
  }
  
  function launchWebApp() {
    const html = HtmlService.createHtmlOutputFromFile('webApp/indexHTML').setWidth(500).setHeight(1000);
    SpreadsheetApp.getUi().showModalDialog(html, 'Оценить заказ');
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------