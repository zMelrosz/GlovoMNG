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