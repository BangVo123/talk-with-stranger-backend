const nodemailer = require("nodemailer");

const sendMail = async (mailOptions, auth) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: auth,
  });

  let resp = await transport.sendMail(mailOptions);

  return resp;
};

module.exports = {
  sendMail,
};
