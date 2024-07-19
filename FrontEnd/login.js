document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    const baseUrl = `https://bhagirathmedicinebackend-api.onrender.com`;
    // const baseUrl = `http://127.0.0.1:4000`;

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

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(loginForm);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            showLoader();
            const response = await fetch(`${baseUrl}/api/v1/login`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password }),
                    credentials: 'include',
                });

            const data = await response.json();
            hideLoader();

            if (response.ok) {
                showNotification(data.message);
                const token = localStorage.setItem('token', data.token);

                if (data.user.role === "User") {
                    window.location.href = 'userDashboard.html';
                } else {
                    window.location.href = 'adminDashboard.html';
                }
            } else {
                showNotification(data.message);
            }
        } catch (error) {
            console.error('Error logging in:', error);
            // errorMessage.textContent = 'Internal Server Error. Please try again later.';
        }
    });
});
