module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { name, email, interest, message } = req.body;

    // Basic validation
    if (!name || !email || !interest || !message) {
      return res.status(400).json({ success: false, error: 'Please fill in all fields.' });
    }

    // --- Google Sheets Submission Logic ---
    const googleAppsScriptUrl = process.env.GOOGLE_SHEETS_WEB_APP_URL;

    if (!googleAppsScriptUrl) {
      console.error('GOOGLE_SHEETS_WEB_APP_URL environment variable is not set.');
      return res.status(500).json({ success: false, error: 'Server configuration error: Google Sheets URL missing.' });
    }

    try {
      const googleSheetsResponse = await fetch(googleAppsScriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, interest, message }),
        redirect: 'follow', // Apps Script redirects once deployed
      });

      const googleSheetsResult = await googleSheetsResponse.json();

      if (googleSheetsResult.result === 'success') {
        res.status(200).json({ success: true, message: 'Message stored successfully!' });
      } else {
        console.error('Google Sheets error:', googleSheetsResult.message);
        res.status(500).json({ success: false, error: `Failed to store message in Google Sheets: ${googleSheetsResult.message}` });
      }
    } catch (error) {
      console.error('Error sending data to Google Sheets:', error);
      res.status(500).json({ success: false, error: 'Failed to store message.', details: error.message });
    }

  } else {
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
};
