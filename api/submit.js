const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { name, email, interest, message } = req.body;

    // Basic validation
    if (!name || !email || !interest || !message) {
      return res.status(400).json({ success: false, error: 'Please fill in all fields.' });
    }

    // --- Email Sending Logic ---
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    try {
      await transporter.sendMail({
        from: `"${name}" <${email}>`,
        to: 'contact@complexity-ai.com',
        subject: `New Contact Form Submission: ${interest}`,
        html: `
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Interest:</strong> ${interest}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      });
      // console.log('Email sent successfully.');
    } catch (error) {
      console.error('Error sending email:', error);
      // Decide if you want to fail the entire submission or just log the email error
      // For now, we'll continue to Google Sheets even if email fails
    }

    // --- Google Sheets Submission Logic ---
    const googleAppsScriptUrl = process.env.GOOGLE_SHEETS_WEB_APP_URL;

    if (!googleAppsScriptUrl) {
      console.error('GOOGLE_SHEETS_WEB_APP_URL environment variable is not set.');
      // This might be a critical error depending on your requirements
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
        res.status(200).json({ success: true, message: 'Message sent and stored successfully!' });
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
