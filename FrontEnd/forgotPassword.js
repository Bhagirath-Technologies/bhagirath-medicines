document.addEventListener('DOMContentLoaded', () => {
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const notification = document.getElementById('notification');
    const submitButton = document.getElementById('submitButton');
    const emailInput = document.getElementById('email');

    const baseUrl = `https://bhagirathmedicinebackend-api.onrender.com`;
    // const baseUrl = `http://127.0.0.1:4000`;

    forgotPasswordForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = emailInput.value;

        // Disable the submit button
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        try {
            const response = await fetch(`${baseUrl}/api/v1/password/forgot`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email })
                });

            const data = await response.json();

            if (response.ok) {
                showNotification(data.message);
            } else {
                showNotification(data.message);
            }
        } catch (error) {
            showNotification('An error occurred. Please try again.');
            console.error('Error:', error);
        } finally {
            // Re-enable the submit button
            submitButton.disabled = false;
            submitButton.textContent = 'Submit';
            emailInput.value = '';
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
