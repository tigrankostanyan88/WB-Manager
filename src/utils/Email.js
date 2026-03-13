const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const { htmlToText } = require('html-to-text');

const templatesPath = path.join(__dirname, '../../views/email');

class Email {
  constructor(user, url, data = {}) {
    this.user = user;
    this.to = user.email;
    this.url = url;
    this.data = data;

    const fromName = process.env.EMAIL_FROM_NAME || 'MG-Drive';
    const fromEmail = process.env.EMAIL_FROM_EMAIL;

    if (!fromEmail) {
      throw new Error('EMAIL_FROM_EMAIL is not defined');
    }

    this.from = `${fromName} <${fromEmail}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'development') {
      return nodemailer.createTransport({
        host: process.env.SENDPULSE_HOST,
        port: process.env.SENDPULSE_PORT || 2525,
        secure: false,
        auth: {
          user: process.env.SENDPULSE_USERNAME,
          pass: process.env.SENDPULSE_PASSWORD
        }
      });
    }

    // Production → Gmail
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 465,
      secure: true,
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async send(template, subject) {
    const data = {
      name: this.user.name || '',
      email: this.user.email,
      url: this.url,
      ...this.data
    };

    const html = await ejs.renderFile(
      path.join(templatesPath, `${template}.ejs`),
      data
    );

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html)
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendRegister() {
    await this.send('register', 'Նոր գրանցում');
  }

  async sendPasswordReset() {
    await this.send('resetPassword', 'Գաղտնաբառի վերականգնում');
  }

  async sendCheckout() {
    await this.send('checkout', 'Նոր պատվեր (վճարում)');
  }
}

module.exports = Email;