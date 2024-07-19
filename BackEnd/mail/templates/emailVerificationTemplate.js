const emailVerification = (otp) => {
    return `
        <html>
        <head>
            <style>
               body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    background-color: #f9f9f9;
                }
                .logo {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .otp-content {
                    padding: 10px;
                    background-color: #fff;
                    border-radius: 5px;
                    margin-bottom: 20px;
                }
                .footer {
                    font-size: 12px;
                    color: #666;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="logo">
                   <a href="https://www.bhagirathtechnologies.com"><img src="https://media.licdn.com/dms/image/D4D0BAQF5fpPM2OwhTg/company-logo_200_200/0/1707885589478/bhagirath_technologies_logo?e=2147483647&v=beta&t=p5_N8lf_2M-wXJ-QI6x1Qy-v_q-bRa7FH-nWcKEVXw0" alt="Company Logo" width="100" height="auto"></a>
                </div>
                <div class="otp-content">
                    <p>Dear User,</p>
                    <p>Your OTP for email verification is: <strong>${otp}</strong></p>
                    <p>Please enter this OTP to verify your email address. The OTP is valid for 5 minutes.</p>
                    <p>If you did not request this email, please ignore it.</p>
                </div>
                <div class="footer">
                    <p>Thank you,<br>Your Service Team</p>
                </div>
            </div>
        </body>
        </html>
    `;
};

module.exports = emailVerification;
