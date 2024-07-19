document.addEventListener('DOMContentLoaded', () => {
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    const submitButton = document.getElementById('submitButton');
    const PasswordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const notification = document.getElementById('notification');

    const baseUrl = `https://bhagirathmedicinebackend-api.onrender.com`;
    // const baseUrl = `http://127.0.0.1:4000`;

    //--------------------------------------------------------------------------------
    // Function to get query parameters
    // function getQueryParams() {
    //     const params = new URLSearchParams(window.location.search);
    //     return Object.fromEntries(params.entries()).token;
    // }
    // const token = getQueryParams();

    // We can use both below code or above for getting the token

    const token = window.location.search.split('=')[1];

    if (!token) {
        showNotification('Invalid or missing token.');
        return;
    }
    //--------------------------------------------------------------------------------


    resetPasswordForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const password = PasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (password !== confirmPassword) {
            showNotification('Passwords do not match.');
            return;
        }

        // Disable the submit button
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        try {
            const response = await fetch(`${baseUrl}/api/v1/password/reset/${token}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ password, confirmPassword })
                });

            const data = await response.json();

            if (response.ok) {
                showNotification(data.message);

                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                showNotification(data.message);
            }
        } catch (error) {
            showNotification('An error occurred. Please try again.');
            console.error('Error:', error);
        } finally {
            // Re-enable the submit button and clear the input fields
            submitButton.disabled = false;
            submitButton.textContent = 'Submit';
            PasswordInput.value = '';
            confirmPasswordInput.value = '';
        }
    });

    function showNotification(message) {
        notification.textContent = message;
        notification.className = "notification show";

        setTimeout(() => {
            notification.className = notification.className.replace(" show", "");
        }, 3000);
    }
});
