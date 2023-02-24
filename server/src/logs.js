function copyAndLog(fromSheet, toSheet, range) {
  const sourceRange = fromSheet.getRange(range);
  const firstEmptyRow = toSheet.getLastRow() + 1;

  const pasteRange = toSheet.getRange(firstEmptyRow, 1, sourceRange.getNumRows(), sourceRange.getNumColumns());
  pasteRange.setValues(sourceRange.getValues());

  // set euro format
  const formatRange = toSheet.getRange(firstEmptyRow, 3, sourceRange.getNumRows(), 3);
  formatRange.setNumberFormat('#,##0.00 €');

  // set bold font
  const lastRow = pasteRange.getLastRow();
  const lastRowRange = toSheet.getRange(lastRow, 1, 1, pasteRange.getNumColumns());
  lastRowRange.setFontWeight("bold");

  // set borders
  const borderRange = toSheet.getRange(firstEmptyRow, 1, pasteRange.getNumRows(), pasteRange.getNumColumns());
  borderRange.setBorder(true, true, true, true, true, true);

  const startDateCell = [pasteRange.getRow(), pasteRange.getColumn()];
  const endComissionCell = [pasteRange.getRow(), pasteRange.getColumn() + 4];
  const numOfMergeRows = getUsers().length;

  mergeCells(toSheet, startDateCell, numOfMergeRows);
  mergeCells(toSheet, endComissionCell, numOfMergeRows + 1);
}


  function logOrderHistory() {
    try {
      copyAndLog(monitorSheet, historySheet, monitorLogRange);
      SpreadsheetApp.getActive().toast('History logged succesful!');
    } catch (e) {
      SpreadsheetApp.getActive().toast('History log error: ' + e);
    }
  }

  function takeScreenshot(sheet, range) {
    const rangeValues = sheet.getRange(range).getValues();
    const numRows = rangeValues.length;
    const numColumns = rangeValues[0].length;
    const width = numColumns * 100;
    const height = numRows * 20;
    const image = sheet.getSheetValues(1, 1, numRows, numColumns).map(r => r.join('\t')).join('\n');
    const url = 'https://chart.googleapis.com/chart?cht=gv&chl=' + encodeURIComponent(image) + '&chs=' + width + 'x' + height;
    const response = UrlFetchApp.fetch(url);
    const content = response.getContent();
    const screenshot = Utilities.base64Encode(content);
    return screenshot;
  }