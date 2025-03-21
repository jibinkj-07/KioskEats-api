const { onboardTemplate, resetPasswordTemplate } = require("./emailTemplates");

const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendWelcomeMail = async (name, toMail, link) => {
  try {
    const data = await resend.emails.send({
      from: "KioskEats <onboarding@resend.dev>",
      to: toMail,
      subject: "Welcome to Kioskeats",
      html: onboardTemplate.replace("{name}", name).replace("{link}", link),
    });
    console.log(`email - ${JSON.stringify(data)}`);
  } catch (err) {
    console.log(err);
  }
};

const sendResetMail = async (name, toMail, link, expiresIn) => {
  try {
    const data = await resend.emails.send({
      from: "KioskEats <onboarding@resend.dev>",
      to: toMail,
      subject: "Reset Password",
      html: resetPasswordTemplate
        .replace("{name}", name)
        .replace("{link}", link)
        .replace("{expireTime}", expiresIn),
    });
    console.log(`email - ${JSON.stringify(data)}`);
  } catch (err) {
    console.log(err);
  }
};

module.exports = { sendWelcomeMail, sendResetMail };
