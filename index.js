require('dotenv').config();
const express = require('express');
const schedule = require('node-schedule');
const reportRoutes = require('./routes/report');
const { generateMonthlyReport } = require('./utils/reportGenerator');
const { sendEmailReport } = require('./utils/emailSender');
const app = express();

app.use(express.json());
app.use(reportRoutes);

const scheduleJob = schedule.scheduleJob('10 11 1 * *', () => {
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  console.log(`Bắt đầu tạo và gửi báo cáo tháng ${month}/${year}...`);
  const reportData = generateMonthlyReport(month, year);
  sendEmailReport(reportData);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT} - ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`);
});