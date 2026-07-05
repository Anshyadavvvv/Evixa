import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendotpemail = async (email, otp, type) => {
  try {
    const title =
      type === "account_verification"
        ? "Account Verification OTP"
        : "Event Booking OTP";
    const msg =
      type === "account_verification"
        ? "Please use the following OTP to verify your account."
        : "Please use the following OTP to complete your event booking.";

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: title,
      html: `<div style="background-color:#f4f6fb; padding:40px 0; font-family:'Segoe UI', Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 8px 24px rgba(0,0,0,0.08);">

          <tr>
            <td style="background:linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899); padding:35px; text-align:center;">
              <div style="font-size:36px;">🔐</div>
              <h1 style="color:#fff; margin:10px 0 0; font-size:22px;">Verify Your Identity</h1>
            </td>
          </tr>

          <tr>
            <td style="padding:35px; text-align:center;">
              <p style="color:#4b5563; font-size:15px; margin:0 0 20px;">
                Apna login/verification complete karne ke liye niche diya gaya OTP use karein:
              </p>

              <div style="background:#f5f3ff; border:1px dashed #8b5cf6; border-radius:12px; padding:18px; margin:20px 0;">
                <span style="font-size:34px; font-weight:700; letter-spacing:10px; color:#5b21b6;">
                  ${otp}
                </span>
              </div>

              <p style="color:#9ca3af; font-size:13px; margin:20px 0 0;">
                Ye OTP <b>10 minutes</b> mein expire ho jayega. Agar aapne ye request nahi ki, to is email ko ignore karein.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:0 35px 30px; text-align:center;">
              <hr style="border:none; border-top:1px solid #eef0f3; margin-bottom:16px;" />
              <p style="color:#9ca3af; font-size:12px; margin:0;">
                © ${new Date().getFullYear()} DevShowcase. Made with 💜 in India.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</div>`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${email} for ${type}`);
  } catch (error) {
    console.error(`Error sending OTP email to ${email}:`, error);
  }
};

export const sendbookingconfirmationemail = async (
  userEmail,
  userName,
  eventTitle,
) => {
  try {
    const mailoptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Booking Confirmation for ${eventTitle}`,
      html: `<div style="background-color:#f4f6fb; padding:40px 0; font-family:'Segoe UI', Arial, sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">
            <table role="presentation" width="500" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 8px 24px rgba(0,0,0,0.08);">

              <tr>
                <td style="background:linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899); padding:35px; text-align:center;">
                  <div style="font-size:36px;">✅</div>
                  <h1 style="color:#fff; margin:10px 0 0; font-size:22px;">Booking Confirmed!</h1>
                </td>
              </tr>

              <tr>
                <td style="padding:35px; text-align:center;">
                  <p style="color:#4b5563; font-size:15px; margin:0 0 20px;">
                    Hi <b>${userName}</b>, aapki booking successfully confirm ho gayi hai 🎊
                  </p>

                  <div style="background:#f5f3ff; border-left:4px solid #8b5cf6; border-radius:10px; padding:18px 20px; margin:20px 0; text-align:left;">
                    <p style="margin:0; color:#6b7280; font-size:13px;">EVENT</p>
                    <p style="margin:4px 0 0; color:#1f2937; font-size:18px; font-weight:700;">${eventTitle}</p>
                  </div>

                  <p style="color:#9ca3af; font-size:13px; margin:20px 0 0;">
                    Event se judi koi bhi update aapko is email par milti rahegi. Agar kisi bhi cheez mein help chahiye ho to reply karein.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding:0 35px 30px; text-align:center;">
                  <hr style="border:none; border-top:1px solid #eef0f3; margin-bottom:16px;" />
                  <p style="color:#9ca3af; font-size:12px; margin:0;">
                    © ${new Date().getFullYear()} DevShowcase. Made with 💜 in India.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </div>`,
    };
  } catch (error) {
    console.log(
      `Error sending booking confirmation email to ${userEmail}:`,
      error,
    );
  }

  await transporter.sendMail(mailoptions);
  console.log(`Booking confirmation email sent to ${userEmail}`);

};
