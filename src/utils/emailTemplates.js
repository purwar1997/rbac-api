const getCurrentYear = () => {
  const currentDate = new Date();
  return currentDate.getFullYear();
};

export const getPasswordResetEmail = resetPasswordUrl => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body
    style="
      margin: 0;
      background-color: #f4f4f4;
      padding: 15px;
      font-family: Segoe UI, Tahoma, Geneva, Verdana, sans-serif;
    "
  >
    <div
      style="
        width: 100%;
        max-width: 640px;
        background-color: #ffffff;
        padding: 30px 25px;
        margin: auto;
        box-sizing: border-box;
      "
    >
      <div style="text-align: center">
        <h1 style="margin: 0; font-size: 30px; font-weight: 700; color: #6366f1">RBAC System</h1>
      </div>

      <div style="margin-top: 25px; text-align: center">
        <h2 style="margin: 0; font-size: 20px; font-weight: 500; color: #4b4b4b">
          Reset Your Password
        </h2>

        <p style="margin: 0; margin-top: 20px; font-size: 15px; line-height: 1.5">
          We have received a request to reset your password. Please click the button below to create
          a new password.
        </p>

        <a
          style="
            display: inline-block;
            padding: 12px 25px;
            margin-top: 25px;
            background-color: #6366f1;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-size: 15px;
            font-weight: 500;
          "
          href=${resetPasswordUrl}
          >Reset Password</a
        >

        <p style="margin: 0; margin-top: 20px; font-size: 15px; line-height: 1.5">
          If you did not request a password reset, please ignore this email.
        </p>
      </div>

      <div style="margin-top: 40px; text-align: center; color: #888; font-size: 12px">
        <p style="margin: 0">&copy; ${getCurrentYear()} RBAC System. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
`;
