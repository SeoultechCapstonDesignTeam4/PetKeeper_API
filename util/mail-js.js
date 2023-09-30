const nodemailer = require('nodemailer');
const { MAIL_SERVICE, MAIL_USER, MAIL_PASSWORD } = process.env;

const transporter = nodemailer.createTransport({
  service: MAIL_SERVICE,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASSWORD
  }
});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: MAIL_USER,
    to: to,
    subject: subject,
    text: text
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email Sent : ', info);
    }
  });
}

module.exports={
  sendEmail
}
// // 예제로 이메일 보내기
// sendEmail('hchbae1001@gmail.com', 'Nodemailer Test', '노드 패키지 nodemailer를 이용해 보낸 이메일임');
