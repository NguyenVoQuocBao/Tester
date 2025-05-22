require('dotenv').config();
const express = require('express');
const schedule = require('node-schedule');
const { generateMonthlyReport } = require('./utils/reportGenerator');
const { sendEmailReport } = require('./utils/emailSender');
const app = express();

app.use(express.json());

// API endpoint để gửi báo cáo theo yêu cầu
app.post('/generate-report', async (req, res) => {
  const { month, year } = req.body;

  if (!month || !year) {
    return res.status(400).json({ message: 'Thiếu thông tin tháng hoặc năm' });
  }

  // Tổng hợp dữ liệu báo cáo
  const reportData = generateMonthlyReport(month, year);

  // Gửi email báo cáo
  const emailSent = await sendEmailReport(reportData);

  if (emailSent) {
    res.status(200).json({
      message: 'Báo cáo đã được tạo và email đã được gửi',
      report: reportData,
    });
  } else {
    res.status(500).json({ message: 'Gửi email thất bại' });
  }
});

// Lên lịch gửi báo cáo tự động vào ngày 1 mỗi tháng lúc 11:10 AM +07
const scheduleJob = schedule.scheduleJob('10 11 1 * *', () => {
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1; // Tháng hiện tại (1-12)
  const year = currentDate.getFullYear();
  console.log(`Bắt đầu tạo và gửi báo cáo tháng ${month}/${year}...`);
  const reportData = generateMonthlyReport(month, year);
  sendEmailReport(reportData);
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT} - ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`);
});