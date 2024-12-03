const { google } = require('googleapis');
require('dotenv').config();

// Decode the base64-encoded credentials from the environment variable
const encodedCredentials = process.env.GOOGLE_SHEETS_CREDENTIALS;
if (!encodedCredentials) {
  throw new Error('GOOGLE_SHEETS_CREDENTIALS environment variable is not set.');
}

const credentials = JSON.parse(Buffer.from(encodedCredentials, 'base64').toString('utf-8'));

// Initialize Google Auth
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Create an instance of Google Sheets API
const sheets = google.sheets({ version: 'v4', auth });

/**
 * Function to append data to a Google Sheet
 * @param {string} spreadsheetId - The ID of the Google Sheet
 * @param {string} range - The range where the data will be appended (e.g., "Sheet1!A1")
 * @param {Array} values - The data to append as an array of values
 */
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
    // Append data to the sheet
    const response = await sheets.spreadsheets.values.append(request);
    console.log('Data appended successfully:', response.data);
  } catch (error) {
    console.error('Error appending to Google Sheets:', error.message);
    console.error('Error details:', error.response?.data || error);
  }
};

module.exports = { appendToSheet };
