/* eslint-disable guard-for-in */
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

function launchWebApp() {
  const html = HtmlService.createHtmlOutputFromFile('indexHTML').setWidth(500).setHeight(1000);
  SpreadsheetApp.getUi().showModalDialog(html, 'Оценить заказ');
}

// ---------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------Global variables--------------------------------------------------------------
const timeZone = 'Europe/Monaco';
const dateFormat = 'dd.MM.yyyy';
const restsRange = 'A2:RB25';
// ---------- ----------------------------------------------Sheets variables--------------------------------------------------------------

const restaurantsSheet = getSheet('Рестораны');
const monitorSheet = getSheet('Монитор');
const ratingSheet = getSheet('CustomVoteAnswers');
const debetKreditSheet = getSheet('DebetKredit');
const monitorRange = 'B3:D13';
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

function getFirstEmptyRowInColumn(sheet, column) {
  const columnLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (column < 1) {
    return null;
  }
  let columnLetter = '';
  let columnNumber = column;
  while (columnNumber > 0) {
    columnLetter = columnLetters.charAt((columnNumber - 1) % 26) + columnLetter;
    columnNumber = Math.floor((columnNumber - 1) / 26);
  }
  let lastRow = sheet.getLastRow();
  if (!lastRow) {
    lastRow = 1;
  }
  const values = sheet.getRange(`${columnLetter}1:${columnLetter}${lastRow}`).getValues();
  for (let i = 0; i < values.length; i++) {
    if (!values[i][0]) {
      return i + 1;
    }
  }
  return values.length + 1;
}

function sortRows() {
  const range = restaurantsSheet.getRange(restsRange);
  const sortOrder = { column: 2, ascending: false };
  range.sort(sortOrder);
  SpreadsheetApp.getActive().toast('Restaraunt rows succesfully sorted');
}

function getOrdersAndValues(sheet, range) {
  const data = sheet.getRange(range).getValues();
  const result = {};

  for (let i = 0; i < data.length; i++) {
    const firstColumn = data[i][0];
    const thirdColumn = data[i][2];
    if (thirdColumn !== 0) {
      result[firstColumn] = thirdColumn;
    }
  }

  return result;
}

function updateKreditTable() {
  const orderObject = getOrdersAndValues(monitorSheet, monitorRange);

  for (let i = 0; i < Object.keys(orderObject).length; i++) {
    const textFinder = debetKreditSheet.createTextFinder(Object.keys(orderObject)[i]);
    const findedName = textFinder.findNext();
    const findedOrderValue = orderObject[Object.keys(orderObject)[i]];

    if (!findedName) {
      SpreadsheetApp.getActive().toast('ERROR while processing order values!');
      return;
    }

    const kreditColumn = findedName.getColumn() + 1;
    const kreditRow = getFirstEmptyRowInColumn(debetKreditSheet, kreditColumn);
    const dateColumn = kreditColumn + 1;
    const dateRow = kreditRow; // on the same row

    debetKreditSheet.getRange(kreditRow, kreditColumn).setValue(findedOrderValue); // put kredit value
    debetKreditSheet.getRange(dateRow, dateColumn).setValue(getDate()); // put kredit data value
  }
  SpreadsheetApp.getActive().toast('Today orders has been succesfully processed!');
}
function debug() {
  // some code for debug
}
// ----------------------------------------------------------------------------------------------------------------------------------------
