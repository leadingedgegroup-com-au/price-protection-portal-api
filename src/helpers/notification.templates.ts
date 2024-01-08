import appConfiguration from "src/app.configuration";

/**
 * List of templates used within the application. Includes key value pairs, email templates etc.
 *
 * @author Rajendra Kumar Majhi
 * @since 28 June 2022
 */

export const NotificationTemplates = {
   WelcomeInvitation: {
      email: `
        <!doctype html>
        <html lang="en-US">
           <head>
              <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
              <title> Scan, Sales & Protection Portal</title>
              <meta content="EMAIL_TEMPLATE_WELCOME" name="description">
              <meta content="rAJENDRA" name="author">
           </head>
           <style>
              a:hover {
              text-decoration: underline !important;
              }
           </style>
           <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f0f0f0;" leftmargin="0">
              <div style="margin:0;padding:0" bgcolor="#F0F0F0" marginwidth="0" marginheight="0">
                 <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" bgcolor="#F6f6f6">
                    <tbody>
                       <tr>
                          <td align="center" valign="top" bgcolor="#F0F0F0" style="background-color:#f0f0f0">
                             <br>
                             <table border="0" width="800" cellpadding="0" cellspacing="0" style="width:800px;max-width:800px;width:100%;">
                                <tbody>
                                   <tr>
                                      <td align="left" style="box-shadow: 0px 6px 17px 0px #00000017;
                                         border: 1px solid #c0c0c03d; font-family:'Open Sans', sans-serif; text-align:center; 
                                         font-size:24px;font-weight:bold;padding-bottom:12px;color:#fff;
                                         padding-left:24px;padding-right:24px;background:#f7f7f7;padding-top:9px;">
                                         <img style="width: 100px" src="${appConfiguration().PORTAL.LOGO}" alt="logo">
                                      </td>
                                   </tr>
                                   <tr>
                                      <td align="left" style="padding-left:24px;padding-right:24px;padding-top:12px;padding-bottom:12px;background-color:#ffffff;">
                                         <br>
                                         <div style="font-size:14px;line-height:20px;text-align:left;color:#333333">
                                            <p>Dear {{FirstName}},</p>
                                            <p>{{Context}}</p>
                                            <p>Please find the below credentials</p>
                                            <p><b>Username </b>: {{Email}}</p>
                                            <p><b>Password</b>: {{Password}}</p>
                                            </br>
                                            <p style="text-align:center; margin:0px;">
                                               <button style="background: #df1737;padding: 8px 9px;border: 1px solid #fbb61d;border-radius: 5px;"/><a style="color: #fff;text-decoration: none;" href="${appConfiguration().PORTAL.HOST}">CLICK HERE TO LOGIN</a></button>
                                            </p>
                                            <h3 style="text-align: center">OR</h3>
                                            <p>Please visit <a href="${appConfiguration().PORTAL.HOST}">${appConfiguration().PORTAL.HOST} </a> and for any questions contact your Leading Edge category manager.</p>
                                            <br>Thanks,
                                            <br><strong>Leading Edge Group Category Team</strong></p>
                                            <br>
                                         </div>
                                      </td>
                                   </tr>
                                   <tr>
                                      <td style="text-align:center;">
                                         <p style="font-size:14px; color:white; line-height:18px; width: 800px; margin: auto; background-color: #808080; padding: 7px 0px;">
                                            &copy; <strong>All Rights Reserved © ${new Date()?.getFullYear()} Scans, Sales and Price Protection portal </strong>
                                         </p>
                                      </td>
                                   </tr>
                                </tbody>
                             </table>
                          </td>
                       </tr>
                    </tbody>
                 </table>
                 <br>
              </div>
           </body>
        </html>`,
      socket: `{{Context}}`
   },
   ForgotPasswordLink: {
      email: `
      <!doctype html>
      <html lang="en-US">
         <head>
            <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
            <title> Scan, Sales & Protection Portal</title>
            <meta content="EMAIL_TEMPLATE_WELCOME" name="description">
            <meta content="rAJENDRA" name="author">
         </head>
         <style>
            a:hover {
            text-decoration: underline !important;
            }
         </style>
         <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f0f0f0;" leftmargin="0">
            <div style="margin:0;padding:0" bgcolor="#F0F0F0" marginwidth="0" marginheight="0">
               <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" bgcolor="#F6f6f6">
                  <tbody>
                     <tr>
                        <td align="center" valign="top" bgcolor="#F0F0F0" style="background-color:#f0f0f0">
                           <br>
                           <table border="0" width="800" cellpadding="0" cellspacing="0" style="width:800px;max-width:800px;width:100%;">
                              <tbody>
                                 <tr>
                                    <td align="left" style="box-shadow: 0px 6px 17px 0px #00000017;
                                       border: 1px solid #c0c0c03d; font-family:'Open Sans', sans-serif; text-align:center; 
                                       font-size:24px;font-weight:bold;padding-bottom:12px;color:#fff;
                                       padding-left:24px;padding-right:24px;background:#f7f7f7;padding-top:9px;">
                                       <img style="width: 100px" src="${appConfiguration().PORTAL.LOGO}" alt="logo">
                                    </td>
                                 </tr>
                                 <tr>
                                    <td align="left" style="padding-left:24px;padding-right:24px;padding-top:12px;padding-bottom:12px;background-color:#ffffff;">
                                       <br>
                                       <div style="font-size:14px;line-height:20px;text-align:left;color:#333333">
                                          <p>Dear {{FirstName}},</p>
                                          <p>We have received a request to reset your password for your account associated with Scan,Sales and Price Protection Portal. To proceed with the password reset, please click on the link below: </p>
           
                                          </br>
                                          <p style="text-align: center; margin: 0;">
                                          <a href="{{FP_LINK}}" style="text-decoration: none; display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #ffffff; font-weight: bold; border-radius: 5px;">
                                            Reset Password
                                          </a>
                                        </p>
                                        

                                          <br>Thanks,
                                          <br><strong>Leading Edge Group Category Team</strong></p>
                                          <br>
                                       </div>
                                    </td>
                                 </tr>
                                 <tr>
                                    <td style="text-align:center;">
                                       <p style="font-size:14px; color:white; line-height:18px; width: 800px; margin: auto; background-color: #808080; padding: 7px 0px;">
                                          &copy; <strong>All Rights Reserved © ${new Date()?.getFullYear()} Scans, Sales and Price Protection portal </strong>
                                       </p>
                                    </td>
                                 </tr>
                              </tbody>
                           </table>
                        </td>
                     </tr>
                  </tbody>
               </table>
               <br>
            </div>
         </body>
      </html>
      `,
      socket: ``
   },
   ResetPassword: {
      email: `
      <!DOCTYPE html>
  <html lang="en-US">

  <head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <title>Password Change - Scan, Sales & Protection Portal</title>
    <meta content="EMAIL_TEMPLATE_PASSWORD_CHANGE" name="description">
    <meta content="Scans, Sales and Price Protection portal" name="author">
    <style>
      a:hover {
        text-decoration: underline !important;
      }
    </style>
  </head>

  <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f0f0f0;" leftmargin="0">
    <div style="margin:0;padding:0" bgcolor="#F0F0F0" marginwidth="0" marginheight="0">
      <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" bgcolor="#F6f6f6">
        <tbody>
          <tr>
            <td align="center" valign="top" bgcolor="#F0F0F0" style="background-color:#f0f0f0">
              <br>
              <table border="0" width="800" cellpadding="0" cellspacing="0" style="width:800px;max-width:800px;width:100%;">
                <tbody>
                  <tr>
                    <td align="left" style="box-shadow: 0px 6px 17px 0px #00000017;
                                       border: 1px solid #c0c0c03d; font-family:'Open Sans', sans-serif; text-align:center; 
                                       font-size:24px;font-weight:bold;padding-bottom:12px;color:#fff;
                                       padding-left:24px;padding-right:24px;background:#f7f7f7;padding-top:9px;">
                      <img style="width: 100px" src="${appConfiguration().PORTAL.LOGO}" alt="logo">
                    </td>
                  </tr>
                  <tr>
                    <td align="left" style="padding-left:24px;padding-right:24px;padding-top:12px;padding-bottom:12px;background-color:#ffffff;">
                      <br>
                      <div style="font-size:14px;line-height:20px;text-align:left;color:#333333">
                        <p>Dear {{FirstName}},</p>
                        <p>Your password for the account associated with Scan, Sales, and Protection Portal has been successfully changed. Thank you for using our services.</p>

                        <br>
                        <p>Thanks,<br>
                          <strong>Leading Edge Group Category Team</strong>
                        </p>
                        <br>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="text-align:center;">
                      <p style="font-size:14px; color:white; line-height:18px; width: 800px; margin: auto; background-color: #808080; padding: 7px 0px;">
                        &copy; <strong>All Rights Reserved © ${new Date()?.getFullYear()} Scan, Sales, and Protection Portal</strong>
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <br>
    </div>
  </body>

  </html>`}
}