const connection = require('../database/connection');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');


module.exports = {
    async recoverPassword(request, response) {
        const { email } = request.body;

        try {
            const check = await connection('users')
                .select('*')
                .where('email', email)
                .first();

            if (check == null) {
                return response.sendStatus(200);
            }

            const newPassword = crypto.randomBytes(9).toString('base64');
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(newPassword, salt);

            await connection('users')
                .update('password', hash)
                .where('email', email);

            var transporter = nodemailer.createTransport({
                service: process.env.MAIL_SERVICE_PROVIDER,
                auth: {
                    user: process.env.MAIL_SERVICE_USER,
                    pass: process.env.MAIL_SERVICE_PASSWORD
                }
            });

            var mailOptions = {
                from: process.env.MAIL_SERVICE_USER,
                to: email,
                subject: 'Recuperação de senha',
                html: `
                        <table class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #fff;" border="0" cellspacing="0" cellpadding="0">
                        <tbody>
                        <tr>
                        <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
                        <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;">
                        <div class="content" style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 580px; padding: 10px;"><!-- START CENTERED WHITE CONTAINER --> <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">Uma nova senha foi gerada para voc&ecirc;.</span>
                        <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #f2f2f2; border-radius: 3px;"><!-- START MAIN CONTENT AREA -->
                        <tbody>
                        <tr>
                        <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
                        <p><img style="display: block; margin-left: auto; margin-right: auto;" src="https://i.imgur.com/O7Qch2R.png" alt="logo" width="30" height="33" /></p>
                        <table style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" border="0" cellspacing="0" cellpadding="0">
                        <tbody>
                        <tr>
                        <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">
                        <h3>Ol&aacute;, ${check.name}.</h3>
                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">Sua senha foi alterada para <span style="color: #049434;"><strong>${newPassword}</strong></span></p>
                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">&Eacute; uma senha segura, mas recomendamos que altere sua senha para alguma outra de sua prefer&ecirc;ncia assim que poss&iacute;vel.</p>
                        </td>
                        </tr>
                        </tbody>
                        </table>
                        <p style="text-align: center;"><span style="color: #999999; font-size: 12px;">OBA Hortifruti<br/>Av Cesário Crosara  nº 1546<br/>Uberlândia - MG / Brasil</span></p>
                        </td>
                        </tr>
                        <!-- END MAIN CONTENT AREA --></tbody>
                        </table>
                        <!-- END FOOTER --> <!-- END CENTERED WHITE CONTAINER --></div>
                        </td>
                        <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
                        </tr>
                        </tbody>
                        </table>
                        `
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log('\nUNEXPECTED ERROR ON PASSWORD RESET MAIL TRANSPONDER.SENDMAIL: ', error)
                    return response.sendStatus(422);
                } else {
                    return response.sendStatus(200);
                }
            });

        } catch (err) {
            console.log('\nUNEXPECTED ERROR ON PASSWORD RESET: ', err)
            return response.sendStatus(422);
        }

    },

}