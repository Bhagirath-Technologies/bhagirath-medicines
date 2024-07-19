document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');
    const registerButton = document.getElementById('register');
    const otpForm = document.getElementById('otpForm');
    const resendOtpButton = document.getElementById('resendOtpButton');

    const baseUrl = `https://bhagirathmedicinebackend-api.onrender.com`;
    // const baseUrl = `http://127.0.0.1:4000`;

    let registrationData = {};

    const showLoader = () => {
        document.getElementById('loader').style.display = 'block';
    };

    const hideLoader = () => {
        document.getElementById('loader').style.display = 'none';
    };

    function showNotification(message) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = "notification show";

        // After 3 seconds, remove the show class from the notification
        setTimeout(() => {
            notification.className = notification.className.replace(" show", "");
        }, 3000);
    }

    // Collecting User's information
    registrationForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(registrationForm);
        registrationData = {};
        formData.forEach((value, key) => {
            registrationData[key] = value;
        });

        if (registrationData.password.length < 8) {
            showNotification(`Password should not be less than 8 characters`);
            return;
        }

        if (registrationData.password !== registrationData.confirmPassword) {
            showNotification('Both password is not same.');
            return;
        }

        try {
            showLoader();
            const response = await fetch(`${baseUrl}/api/v1/otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: registrationData.email }),
                credentials: 'include',
            });

            const data = await response.json();
            hideLoader();

            if (response.ok) {
                showNotification(data.message);
                document.getElementById('registrationContainer').style.display = 'none';
                document.getElementById('otpContainer').style.display = 'block';
            } else {
                showNotification(data.message);
            }
        } catch (error) {
            showNotification(`An error occurred while sending OTP. Please try again.`);
            console.error('Error:', error);
        }
    });

    // Send OTP
    registerButton.addEventListener('click', (event) => {
        event.preventDefault();
        registrationForm.dispatchEvent(new Event('submit'));
    });

    // Resend OTP
    resendOtpButton.addEventListener('click', (event) => {
        event.preventDefault();
        registrationForm.dispatchEvent(new Event('submit'));
    });

    // Send User's Data With OTP
    otpForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const otp = document.getElementById('otp').value;

        try {
            showLoader();
            const response = await fetch(`${baseUrl}/api/v1/createUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...registrationData, otp }),
                credentials: 'include',
            });

            const data = await response.json();
            hideLoader();

            if (response.ok) {
                showNotification(data.message);
                otpForm.reset();
                const token = localStorage.setItem('token', data.token);
                window.location.href = 'userDashboard.html';
            } else {
                showNotification(data.message);
            }
        } catch (error) {
            showNotification(`An error occurred during OTP verification. Please try again.`);
            console.error('Error:', error);
        }
    });
});
