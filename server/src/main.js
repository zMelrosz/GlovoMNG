
// ---------------------------------------------------------Global variables--------------------------------------------------------------
const timeZone = 'Europe/Monaco';
const dateFormat = 'dd.MM.yyyy';
// --------------------------------------------------------Sheets variables--------------------------------------------------------------

const restaurantsSheet = getSheet('Рестораны');
const monitorSheet = getSheet('Монитор');
const ratingSheet = getSheet('CustomVoteAnswers');
const debetKreditSheet = getSheet('DebetKredit');
const accountsSheet = getSheet('Остаток по счёту');
const debetSheet = getSheet('Debet');
const creditSheet = getSheet('Kredit');
const historySheet = getSheet('История заказов 2023');
// ----------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------Ranges--------------------------------------------------------------
const restsRange = '2:29';
const monitorRange = 'B3:D13';
const monitorLogRange = 'A3:E14';
// ----------------------------------------------------------------------------------------------------------------------------------------
function debug() {
  // some code for debug
}
// ----------------------------------------------------------------------------------------------------------------------------------------