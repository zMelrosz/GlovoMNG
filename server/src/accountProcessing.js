function makeDeposit(processingData) {

    const user = processingData.user;
    const amount = processingData.amount;

    if (!user || !amount) {
        SpreadsheetApp.getUi().alert("Error: Text finder required parameters missing");
        return;
    }

    const userCoords = textFinder(debetSheet, user);
    if (!userCoords) {
        browser.msgBox("Error: User not found in debet sheet");
        return;
    }

    const firstEmptyRow = getFirstEmptyRowInColumn(debetSheet, userCoords[1]);
    if (!firstEmptyRow) {
        browser.msgBox("Error: Could not find first empty row in column");
        return;
    }
    debetSheet.getRange(firstEmptyRow, userCoords[1]).setValue(amount);
    debetSheet.getRange(firstEmptyRow, userCoords[1]+1).setValue(getDate());
    SpreadsheetApp.getActive().toast('Deposit successful!');
}

function makeCredit(processingData) {

  const user = processingData.user;
  const amount = processingData.amount;

  if (!user || !amount) {
      SpreadsheetApp.getUi().alert("Error: Text finder required parameters missing");
      return;
  }

  const userCoords = textFinder(creditSheet, user);
  if (!userCoords) {
      SpreadsheetApp.getUi().alert("Error: User not found in credit sheet");
      return;
  }

  const firstEmptyRow = getFirstEmptyRowInColumn(creditSheet, userCoords[1]);
  if (!firstEmptyRow) {
      SpreadsheetApp.getUi().alert("Error: Could not find first empty row in column");
      return;
  }
  creditSheet.getRange(firstEmptyRow, userCoords[1]).setValue(amount);
  creditSheet.getRange(firstEmptyRow, userCoords[1]+1).setValue(getDate());
  SpreadsheetApp.getActive().toast('Credit successful!');

  return true;
}

function getOrdersFromMonitor(sheet, range) {
    const data = sheet.getRange(range).getValues();
    const ordersObj = [];
  
    for (let i = 0; i < data.length; i++) {
      const firstColumn = data[i][0];
      const thirdColumn = data[i][2];
      if (thirdColumn !== 0) {
        const obj = { user: firstColumn, amount: thirdColumn };
        ordersObj.push(obj);
      }
    }
  
    return ordersObj;
  }

function putOrderInKredit(orderObj) {  // processing for 1 order
    const userCell = textFinder(creditSheet, orderObj.user);
    const userEmptyRow = getFirstEmptyRowInColumn(creditSheet, userCell[1]);
    const userColumn = userCell[1];

    putValue(orderObj.amount, creditSheet, userEmptyRow,userColumn) // put amount
    putValue(getDate(), creditSheet, userEmptyRow, userColumn+1); // put time
  }

  function processOrders() {
    const orders = getOrdersFromMonitor(monitorSheet, monitorRange);

    orders.forEach(function (orderObj) {
      putOrderInKredit(orderObj);
    });
    SpreadsheetApp.getActiveSpreadsheet().toast('Orders succesfully processed');
}