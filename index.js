const express = require('express');
const mongoose = require('mongoose');
const cors=require('cors');
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
app.post('/api/report-sms', (req, res) => {
  const { phone_number, message } = req.body;
  const newReport = new SpamReport({
    type: 'SMS',
    phone_number,
    message,
    report_time: new Date(),
  });
  newReport.save()
    .then(saved=> {
      res.status(201).json(saved);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Failed to report' });
    });
});
app.post('/api/report-call', (req, res) => {
  console.log('Received POST request');
  const { phone_number, call_info } = req.body;
  const newReport = new SpamReport({
    type: 'Call',
    phone_number,
    call_info,
    report_time: new Date(),
  });
  newReport.save()
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Failed to report' });
    });
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
