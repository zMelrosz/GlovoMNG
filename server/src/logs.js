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
    copyAndLog(monitorSheet, historySheet, monitorLogRange);
    /*function makeLogBeautiful() {
      const startDateCell = textFinder(historySheet, getDate());
      const startComissionCell = startDateCell.slice(0, 1).concat(5);
      const numOfMergeRows = getUsers().length;
      
      mergeCells(historySheet, startDateCell, numOfMergeRows);
      mergeCells(historySheet, startComissionCell, numOfMergeRows+1);
    } makeLogBeautiful(); */


  }