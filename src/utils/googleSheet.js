const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const credentials = require(path.join(__dirname, 'google-sheets-service-account.json'));
// Load credentials and authenticate
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const sheets = google.sheets({ version: 'v4', auth });
// Function to append data to Google Sheets
const appendToSheet = async (spreadsheetId, range, values) => {
  const request = {
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    resource: {
      values: [values],
    },
  };
  try {
    await sheets.spreadsheets.values.append(request);
  } catch (error) {
    console.error('Error appending to Google Sheets:', error);
  }
};
module.exports = { appendToSheet };