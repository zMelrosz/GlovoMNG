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