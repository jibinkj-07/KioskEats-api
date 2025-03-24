const onboardTemplate = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap');

        * {
            font-family: 'Nunito', Arial, sans-serif;
        }

        body {
            background: #F5F5F5;
            color: #333333;
            font-size: 15px;
        }

        .container {
            max-width: 60%;
            margin: 25px auto;
            background: #FFFFFF;
            border-radius: 8px;
            border: 1px solid #FF5722;
            overflow: hidden;
        }

        .main {
            padding: 20px;
        }

        .title {
            font-size: 1.5rem;
            font-weight: bold;
        }

        .message {
            margin-top: 1.5rem;
            margin-bottom: 1.5rem;
        }

        .button {
            padding: 10px 20px;
            background: #FF5722;
            color: #FFFFFF !important;
            border-radius: 5px;
        }

        a {
            text-decoration: none;
        }


        .center {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 1.5rem;
            margin-bottom: 1.5rem;
        }

        .about {
            line-height: 5px;
            color: #BDBDBD;
            text-align: center;
            margin-bottom: 2rem;
        }


        @media screen and (max-width: 550px) {
            body {
                font-size: 12px;
            }

            .container {
                max-width: 95%;
            }

            .button {
                width: 60%;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <img src="https://res.cloudinary.com/dhdjmmpp7/image/upload/v1742825419/kioskeats-banner.png" width="100%" />
        <div class="main">
            <div class="title">
                Welcome to KioskEats - Set Up Your Kiosk Today!

            </div>
            <div class="message">
                <p>Dear <Strong>{name},</Strong></p>
                <p>We're excited to have you onboard. With KioskEats, you can
                    streamline
                    orders, enhance customer experience, and manage your restaurant’s kiosk with ease.</p>
                <p>To get started, set up your restaurant’s kiosk by creating your first
                    store. Click the button below
                    to begin</p>
                <div class="center">
                    <a href="{link}" target="_blank" style=" text-decoration: none;
    color: #FFFFFF;text-align: center;
    -webkit-text-fill-color: #FFFFFF;" class="button">
                        Create Store
                    </a>
                </div>
                <p>If you need any assistance, our support team is here to help. Feel
                    free to reach out at
                    <strong>jibinkunnumpurath@gmail.com</strong>
                </p>
                <p>
                    We’re thrilled to be part of your journey!</p>
            </div>
            <div class="about">
                <p>Best Regards,</p>
                <p><strong>The KioskEats Team</strong></p>
                <p>&copy; 2025 KioskEats. All rights reserved.</p>
            </div>
        </div>

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
            font-family: 'Nunito', Arial, sans-serif;
        }

        body {
            background: #F5F5F5;
            color: #333333;
            font-size: 15px;
        }

        .container {
            max-width: 60%;
            margin: 25px auto;
            background: #FFFFFF;
            border-radius: 8px;
            border: 1px solid #FF5722;
            overflow: hidden;
        }

        .main {
            padding: 20px;
        }

        .title {
            font-size: 1.5rem;
            font-weight: bold;
        }

        .message {
            margin-top: 1.5rem;
            margin-bottom: 1.5rem;
        }

        .button {
            padding: 10px 20px;
            background: #FF5722;
            color: #FFFFFF !important;
            border-radius: 5px;
        }

        .center {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 1.5rem;
            margin-bottom: 1.5rem;
        }

        .about {
            line-height: 5px;
            color: #BDBDBD;
            text-align: center;
            margin-bottom: 2rem;
        } a {
            text-decoration: none;
        }


        @media screen and (max-width: 550px) {
            body {
                font-size: 12px;
            }

            .container {
                max-width: 100%;
            }

            .button {
                width: 60%;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <img src="https://res.cloudinary.com/dhdjmmpp7/image/upload/v1742825419/kioskeats-banner.png" width="100%" />
        <div class="main">
            <div class="title">
                Kioskeats Password Reset
            </div>
            <div class="message">
                <p>Dear <Strong>{name},</Strong></p>
                <p>We’ve received a request to reset the password for your Kioskeats
                    account. If you didn’t make
                    this request, please disregard this email.</p>
                <p>To reset your password, please click the link below</p>
                <div class="center">
                    <a href="{link}" target="_blank" style=" text-decoration: none;
    color: #FFFFFF;text-align: center;
    -webkit-text-fill-color: #FFFFFF;" class="button">
                        Reset Password
                    </a>
                </div>

                <p>This link will expire in <strong>{expireTime}</strong> for security
                    purposes. If you’re unable
                    to reset your
                    password within that time, please feel free to request a new link. </p>
                <p>If you need further assistance, don't hesitate to reach out to our support team.</p>
            </div>
            <div class="about">
                <p>Best Regards,</p>
                <p><strong>The KioskEats Team</strong></p>
                <p>&copy; 2025 KioskEats. All rights reserved.</p>
            </div>
        </div>

</body>

</html>`;

module.exports = { onboardTemplate, resetPasswordTemplate };
