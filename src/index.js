// ---------------------------------------------------------google functions--------------------------------------------------------------

function doGet() {
  return HtmlService.createHtmlOutputFromFile('indexHTML');
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Оценить заказ').addItem('Открыть', 'openDialog').addToUi();
}

function openDialog() {
  const html = HtmlService.createHtmlOutputFromFile('indexHTML').setWidth(500).setHeight(1000);

  SpreadsheetApp.getUi().showModalDialog(html, 'Оценить заказ');
}

// ---------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------Global variables--------------------------------------------------------------
const timeZone = 'Europe/Monaco';
const dateFormat = 'dd.MM.yyyy';
// ---------- ----------------------------------------------Sheets variables--------------------------------------------------------------

const restaurantsSheet = getSheet('Рестораны');
const monitorSheet = getSheet('Монитор');
// ----------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------async functions---------------------------------------------------------------
function checkLog() {
  const result = 'im result';
  return result;
}

function getDate() {
  const sheetDate = new Date();
  const sheetFormattedDate = Utilities.formatDate(sheetDate, timeZone, dateFormat);
  return sheetFormattedDate;
}
// ---------------------------------------------------------------------------------------------------------------------------------------

function convertDateToTrial(date) {
  return new Date(date.getTime() - 1000 * 60 * date.getTimezoneOffset()).getTime() / 1000 / 86400 + 25569; // Reference: https://stackoverflow.com/a/6154953
}

function getSheet(name) {
  const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadSheet.getSheetByName(name);

  return sheet;
}

function searchColumn(sheet, row, serachingValue) {
  const column = sheet.getLastColumn();
  let lenght = column;
  const noResult = false;

  while (lenght >= 1) {
    if (sheet.getRange(row, lenght).getValue() === serachingValue) {
      const newCoords = {
        row,
        lenght,
      };
      return newCoords;
    }
    lenght--;
  }
  return noResult;
}

function searchRow(sheet, column, searchingValue) {
  const row = sheet.getLastRow();
  let lenght = row;
  const noResult = false;

  while (lenght >= 1) {
    if (sheet.getRange(lenght, column).getValue() === searchingValue) {
      const newCoords = {
        row: lenght,
        column,
      };
      return newCoords;
    }
    lenght--;
  }
  return noResult;
}

function getLastRestaurant() {
  const todayDate = Utilities.formatDate(monitorSheet.getRange(1, 2).getValue(), timeZone, dateFormat);
  const lastDateCoords = {
    row: 1,
    column: restaurantsSheet.getLastColumn(),
  };
  let lenght = lastDateCoords.column;

  while (lenght >= 1) {
    const checkDate = Utilities.formatDate(
      restaurantsSheet.getRange(lastDateCoords.row, lenght).getValue(),
      timeZone,
      dateFormat
    );
    if (todayDate === checkDate) {
      const restCoords = searchRow(restaurantsSheet, lenght, 1);
      restCoords.column = 1;
      const restName = restaurantsSheet.getRange(restCoords.row, restCoords.column).getValue();
      Logger.log('Rest found');
      return restName;
    }
    lenght--;
  }
  Logger.log('No rest found');
  return false;
}
