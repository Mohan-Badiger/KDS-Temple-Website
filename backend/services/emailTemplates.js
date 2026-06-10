/**
 * Shared HTML Email Template generator for a premium, devotional, and trusted feel.
 * Implements a unified saffron/gold color scheme, beautiful typography, clean layout,
 * and a devotional quote/blessing section.
 */
export const getDevotionalEmailTemplate = ({
  title,
  greetingName = '',
  blessingText = 'May the divine blessings of Lord Kadasiddeshwar bring peace, health, and prosperity to you and your family. 🙏',
  mainContentHtml = '',
  quoteText = '"May the continuous flow of divine grace illuminate your path and bring profound peace."'
}) => {
  const greetingSection = greetingName 
    ? `<h2 style="color: #7c2d12; font-size: 18px; font-weight: 600; margin-top: 0; margin-bottom: 15px;">Namaste ${greetingName},</h2>`
    : `<h2 style="color: #7c2d12; font-size: 18px; font-weight: 600; margin-top: 0; margin-bottom: 15px;">Namaste,</h2>`;

  const quoteSection = quoteText
    ? `<div style="text-align: center; margin: 30px 0; font-style: italic; font-size: 14px; color: #b45309; line-height: 1.6; border-left: 3px solid #d97706; border-right: 3px solid #d97706; padding: 0 15px;">
        ${quoteText}
       </div>`
    : '';

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f6f1eb; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f6f1eb; padding: 20px 0;">
        <tr>
          <td align="center">
            <!-- Email Container -->
            <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05); border: 1px solid #eadecc; margin-bottom: 20px;">
              
              <!-- Header Gradient -->
              <tr>
                <td align="center" style="background: linear-gradient(135deg, #e07a16 0%, #b45309 100%); padding: 35px 20px; border-bottom: 4px solid #d97706;">
                  <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #fffefb; opacity: 0.9; font-weight: 600;">Kadasiddeshwar Temples Management Trust</p>
                  <h1 style="margin: 10px 0 0; font-size: 24px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #ffffff;">${title}</h1>
                </td>
              </tr>

              <!-- Body Content -->
              <tr>
                <td style="padding: 40px 30px; background-color: #ffffff;">
                  <!-- Greeting -->
                  ${greetingSection}

                  <!-- Blessing Text -->
                  <p style="font-size: 15px; line-height: 1.6; color: #4a3b32; margin-top: 0; margin-bottom: 25px;">
                    ${blessingText}
                  </p>

                  <!-- Main Content Card -->
                  <div style="background-color: #faf7f2; border: 1px solid #ebdcc5; border-radius: 8px; padding: 25px; margin-bottom: 30px; color: #4a3b32;">
                    ${mainContentHtml}
                  </div>

                  <!-- Devotional Quote -->
                  ${quoteSection}
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td align="center" style="background-color: #fdfaf6; padding: 30px 20px; border-top: 1px solid #eadecc; font-size: 12px; color: #8c7365; line-height: 1.6;">
                  <p style="margin: 0 0 8px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #7c2d12;">Kadasiddeshwar Temple, Banahatti</p>
                  <p style="margin: 0 0 15px;">Banahatti Temples Trust Committee, Karnataka, India</p>
                  <p style="margin: 0;">Visit our site: <a href="http://Banahattitemples.com" style="color: #d97706; text-decoration: none; font-weight: 600;">banahattitemples.com</a></p>
                  <hr style="border: 0; border-top: 1px solid #ebdcc5; margin: 20px 0; width: 80%;" />
                  <p style="margin: 0; font-size: 10px; color: #a3a3a3; text-transform: uppercase; letter-spacing: 1px;">This is an automated system email. Please do not reply directly.</p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};
