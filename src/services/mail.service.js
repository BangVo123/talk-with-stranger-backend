const nodemailer = require("nodemailer");

const sendMail = async (mailOption, auth) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: auth,
  });

  const mailOptions = mailOption;

  let resp = await transport.sendMail(mailOptions);

  return resp;
};

module.exports = {
  sendMail,
};
