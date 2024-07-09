const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const SpamReport = require('./model/spamReports');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:8082',
  credentials: true
}));

mongoose.connect('mongodb://localhost:27017/spam-reporting', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Connection error:', err);
  });

app.post('/api/report-sms', async (req, res) => {
  try {
    const reportDataArray = req.body; // assuming it's an array of report data objects
    const reportPromises = reportDataArray.map(reportData => {
      const { phone_number, message } = reportData;
      if (!phone_number) {
        throw new Error('phone_number is required');
      }
      const newReport = new SpamReport({
        type: 'SMS',
        phone_number,
        message,
        report_time: new Date(),
      });
      return newReport.save();
    });

    const savedReports = await Promise.all(reportPromises);
    res.status(201).json(savedReports);
  } catch (err) {
    console.error('Error reporting SMS:', err);
    res.status(500).json({ error: 'Failed to report' });
  }
});

app.post('/api/report-call', async (req, res) => {
  try {
    const reportDataArray = req.body; // assuming it's an array of report data objects
    const reportPromises = reportDataArray.map(reportData => {
      const { phone_number, call_info, call_duration } = reportData;
      if (!phone_number) {
        throw new Error('phone_number is required');
      }
      const newReport = new SpamReport({
        type: 'Call',
        phone_number,
        call_info,
        call_duration,
        report_time: new Date(),
      });
      return newReport.save();
    });

    const savedReports = await Promise.all(reportPromises);
    res.status(201).json(savedReports);
  } catch (err) {
    console.error('Error reporting call:', err);
    res.status(500).json({ error: 'Failed to report' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
