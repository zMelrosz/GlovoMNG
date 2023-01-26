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
const ratingSheet = getSheet('CustomVoteAnswers');
// ----------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------async functions---------------------------------------------------------------

function getDate() {
  const sheetDate = new Date();
  const sheetFormattedDate = Utilities.formatDate(sheetDate, timeZone, dateFormat);
  return sheetFormattedDate;
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

function checkVotedUsers(user) {
  const textFinder = ratingSheet.createTextFinder(getDate());
  const allDates = textFinder.findAll();
  if (allDates.length < 1) {
    return true;
  }
  const namesColumn = allDates[0].getColumn() + 1;
  const votedUsers = [];

  for (let i = 0; i < allDates.length; i++) {
    votedUsers.push(ratingSheet.getRange(allDates[i].getRow(), namesColumn).getValue());
  }

  for (let i = 0; i < votedUsers.length; i++) {
    if (user !== votedUsers[i]) {
      // eslint-disable-next-line no-continue
      continue;
    } else return false;
  }
  return true;
}

function processRatingForm(submitData) {
  const emptyRow = getFirstEmptyRow(ratingSheet);
  if (checkVotedUsers(submitData.user)) {
    // Can I put new data to sheet?
    ratingSheet.getRange(emptyRow, 1).setValue(submitData.date);
    ratingSheet.getRange(emptyRow, 2).setValue(submitData.user);
    ratingSheet.getRange(emptyRow, 3).setValue(submitData.rating);
    ratingSheet.getRange(emptyRow, 4).setValue(submitData.restaurant);
  } else throw new Error('You already voted, dont do cheating!');
}
// ----------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------Utils functions----------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------------

function getSheet(name) {
  const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadSheet.getSheetByName(name);

  return sheet;
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

function getFirstEmptyRow(sheet) {
  const cell = sheet.getRange('a1');
  let ct = 0;
  while (cell.offset(ct, 0).getValue() !== '') {
    ct++;
  }
  return ct + 1;
}
