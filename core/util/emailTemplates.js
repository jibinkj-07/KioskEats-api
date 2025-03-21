const onboardTemplate = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap');

        * {
            margin: 0px;
            padding: 0px;
            font-family: 'Nunito', Arial, sans-serif;
        }

        body {
            background: #F5F5F5;
            color: #333333;
        }

        table {
            background: #ffffff;
            margin: 25px auto;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        thead {
            background: #FF5722;
            background-color: #FF5722;
            color: #ffffff;
        }

        thead>tr>th>p {
            color: #e4e4e4;
            font-weight: 300;
            font-size: 13px;
        }

        tbody td {
            padding: 0px 25px;
        }

        .margin-top {
            margin-top: 25px;
        }

        .data-margin-bottom {
            margin-bottom: 20px;
        }

        .margin-bottom {
            margin-bottom: 30px;
        }

        .footer {
            font-size: 13px;
            color: #818181;
        }


        a {
            display: inline-block;
            padding: 10px 20px;
            background: #FF5722;
            color: #FFFFFF;
            text-decoration: none;
            border-radius: 5px;
        }
    </style>
</head>

<body>
    <table cellspacing="0" width="60%" align="center">
        <thead>
            <tr align="left">
                <th width="10%">
                    <img src="https://res.cloudinary.com/dhdjmmpp7/image/upload/v1742472501/kioskeatslogo.png"
                        height="50" width="50" />
                </th>
                <th width="90%">
                    <h3>KioskEats</h3>
                    <p>The Future of Dining Starts Here</p>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr align="center">
                <td colspan="2">
                    <h2 class="margin-top">Welcome to KioskEats</h2>
                </td>
            </tr>
            <tr align="center">
                <td colspan="2">
                    <h4 class="data-margin-bottom">Set Up Your Kiosk Today!</h4>
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <p class="data-margin-bottom">Dear {name},</p>
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <p class="data-margin-bottom">We're excited to have you onboard. With KioskEats, you can
                        streamline
                        orders, enhance customer experience, and manage your restaurant’s kiosk with ease.</p>
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <p class="data-margin-bottom">To get started, set up your restaurant’s kiosk by creating your first
                        store. Click the button below
                        to begin</p>
                </td>
            </tr>
            <tr align="center">
                <td colspan="2">
                    <a href="{link}" target="_blank" class="data-margin-bottom">
                        Create Store
                    </a>
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <p class="data-margin-bottom"> If you need any assistance, our support team is here to help. Feel
                        free to reach out at
                        <strong>jibinkunnumpurath@gmail.com</strong>
                    </p>
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <p class="margin-bottom">
                        We’re thrilled to be part of your journey!</p>
                </td>
            </tr>
            <tr align="center">
                <td colspan="2">
                    <p class="footer">Best Regards,</p>
                    <p class="footer"><strong>The KioskEats Team</strong></p>
                    <p class="margin-bottom footer">&copy; 2025 KioskEats. All rights reserved.</p>
                </td>
            </tr>
        </tbody>
    </table>

</body>

</html>`;

const resetPasswordTemplate = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap');

        * {
            margin: 0px;
            padding: 0px;
            font-family: 'Nunito', Arial, sans-serif;
        }

        body {
            background: #F5F5F5;
            color: #333333;
        }

        table {
            background: #ffffff;
            margin: 25px auto;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        thead {
            background: #FF5722;
            background-color: #FF5722;
            color: #ffffff;
        }

        thead>tr>th>p {
            color: #e4e4e4;
            font-weight: 300;
            font-size: 13px;
        }

        tbody td {
            padding: 0px 25px;
        }

        .margin-top {
            margin-top: 25px;
        }

        .data-margin-bottom {
            margin-bottom: 20px;
        }

        .margin-bottom {
            margin-bottom: 30px;
        }

        .footer {
            font-size: 13px;
            color: #818181;
        }


        a {
            display: inline-block;
            padding: 10px 20px;
            background: #FF5722;
            color: #FFFFFF;
            text-decoration: none;
            border-radius: 5px;
        }
    </style>
</head>

<body>
    <table cellspacing="0" width="60%" align="center">
        <thead>
            <tr align="left">
                <th width="10%">
                    <img src="https://res.cloudinary.com/dhdjmmpp7/image/upload/v1742472501/kioskeatslogo.png"
                        height="50" width="50" />
                </th>
                <th width="90%">
                    <h3>KioskEats</h3>
                    <p>The Future of Dining Starts Here</p>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr align="center">
                <td colspan="2">
                    <h2 class="margin-top">Reset Password Request</h2>
                </td>
            </tr>

            <tr>
                <td colspan="2">
                    <p class="data-margin-bottom">Dear {name},</p>
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <p class="data-margin-bottom">
                        We’ve received a request to reset the password for your Kioskeats account. If you didn’t make
                        this request, please disregard this email.
                    </p>
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <p class="data-margin-bottom">
                        To reset your password, please click the link below
                    </p>
                </td>
            </tr>
            <tr align="center">
                <td colspan="2">
                    <a href="{link}" target="_blank" class="data-margin-bottom">
                        Reset Password
                    </a>
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <p class="data-margin-bottom">
                        This link will expire in <strong>{expireTime}</strong> for security purposes. If you’re unable
                        to reset your
                        password within that time, please feel free to request a new link.
                    </p>
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <p class="margin-bottom">
                        If you need further assistance, don't hesitate to reach out to our support team.
                    </p>
                </td>
            </tr>
            <tr align="center">
                <td colspan="2">
                    <p class="footer">Best Regards,</p>
                    <p class="footer"><strong>The KioskEats Team</strong></p>
                    <p class="margin-bottom footer">&copy; 2025 KioskEats. All rights reserved.</p>
                </td>
            </tr>
        </tbody>
    </table>

</body>

</html>`;

module.exports = { onboardTemplate, resetPasswordTemplate };
