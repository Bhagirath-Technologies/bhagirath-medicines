document.addEventListener('DOMContentLoaded', () => {

    // const token = document.cookie.split('=')[1];
    const token = () => localStorage.getItem('token').trim();
    if (!token()) {
        window.location.href = 'login.html';
    }

    const baseUrl = `https://bhagirathmedicinebackend-api.onrender.com`;
    // const baseUrl = `http://127.0.0.1:4000`;

    const profileButton = document.getElementById('profileButton');
    const myOrderButton = document.getElementById('myOrderButton');
    const orderButton = document.getElementById('orderButton');
    const logoutButton = document.getElementById('logoutButton');

    const changePasswordForm = document.getElementById('changePasswordForm');
    const orderForm = document.getElementById('orderForm');

    const profileSection = document.getElementById('profileSection');
    const changePasswordSection = document.getElementById('changePasswordSection');
    const myOrderSection = document.getElementById('myOrderSection');
    const orderSection = document.getElementById('orderSection');

    const medicineSelect = document.getElementById('medicine');
    const medicineDetails = document.getElementById('medicineDetails');

    const medicineId = document.getElementById('medicineId');
    const medicineCategory = document.getElementById('medicineCategory');
    const medicineType = document.getElementById('medicineType');
    const medicineUses = document.getElementById('medicineUses');
    const medicineBenefits = document.getElementById('medicineBenefits');
    const medicinePrice = document.getElementById('medicinePrice');

    const orderList = document.getElementById('orderList');

    profileButton.addEventListener('click', () => {
        showSection(profileSection);
        fetchProfile();
        changePasswordSection.style.display = 'block'; // Show change password section
    });

    myOrderButton.addEventListener('click', () => {
        showSection(myOrderSection);
        fetchMyOrders();
    })

    orderButton.addEventListener('click', () => {
        showSection(orderSection);
        fetchMedicines();
    });

    logoutButton.addEventListener('click', () => {
        // document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        localStorage.removeItem('token');
        showNotification(`Logout Successful.`)
        window.location.href = 'login.html';
    });

    const showSection = (section) => {
        profileSection.style.display = 'none';
        myOrderSection.style.display = 'none';
        orderSection.style.display = 'none';
        section.style.display = 'block';
    };

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

    // Fetch user's profile
    const fetchProfile = async () => {
        try {
            showLoader();
            const response = await fetch(`${baseUrl}/api/v1/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token()}`
                },
                credentials: 'include',
            });

            const data = await response.json();
            hideLoader();

            if (response.ok) {
                document.getElementById('profileDetails').innerHTML = `
                    <p><strong>Name:</strong> <span contenteditable="true" id="name">${data.user.firstName} ${data.user.lastName}</span></p>
                    <p><strong>Email:</strong> <span contenteditable="true" id="email">${data.user.email}</span></p>
                    <p><strong>Contact Number:</strong> <span contenteditable="true" id="contactNumber">${data.user.contactNumber}</span></p>
                    <p><strong>Address:</strong> <span contenteditable="true" id="address">${data.user.address}</span></p>
                `;
            } else {
                showNotification(data.message);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    // Update user profile
    document.getElementById('updateProfileButton').addEventListener('click', async () => {
        const name = document.getElementById('name').textContent.split(' ');
        const firstName = name[0];
        const lastName = name[1];
        const email = document.getElementById('email').textContent;
        const contactNumber = document.getElementById('contactNumber').textContent;
        const address = document.getElementById('address').textContent;

        const updatedProfile = {
            firstName,
            lastName,
            email,
            contactNumber,
            address,
        };

        try {
            showLoader();
            const response = await fetch(`${baseUrl}/api/v1/update/me`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token()}`
                },
                credentials: 'include',
                body: JSON.stringify(updatedProfile)
            });

            const data = await response.json();
            hideLoader();

            if (response.ok) {
                // alert(data.message);
                showNotification(data.message);
                fetchProfile();
            } else {
                // alert(data.message);
                showNotification(data.message);
                console.error('Failed to update profile');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // Change password
    changePasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (newPassword !== confirmPassword) {
            showNotification(`Passwords do not match.`);
            return;
        }

        try {
            showLoader();
            const response = await fetch(`${baseUrl}/api/v1/password/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token()}`
                },
                credentials: 'include',
                body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
            });

            const data = await response.json();
            hideLoader();

            if (response.ok) {
                showNotification(data.message);
                document.getElementById('currentPassword').value = '';
                document.getElementById('newPassword').value = '';
                document.getElementById('confirmPassword').value = '';
            } else {
                showNotification(data.message);
            }
        } catch (error) {
            console.error('Error changing password:', error);
        }
    });

    // Function to create order list
    const createOrderList = (order) => {

        // Function to format categories
        const formatCategories = (categories) => {
            return categories.map(category => `
            ${category.parentCategoryId.categoryName}: ${category.subCategoryName}
        `).join('<br>');
        };

        const items = order.orderItems.map(item => `
            <div class="order-item">
                <p><h3>Order Item:</h3></p>
                <p><strong>Medicine Name:</strong> ${item.name}</p>
                <p><strong>Medicine ID:</strong> ${item.medicineId.medicineId}</p>
                <p><strong>Category:</strong><br> ${formatCategories(item.medicineId.category)}</p>
                <p><strong>Uses:</strong> ${item.medicineId.uses}</p>
                <p><strong>Benefits:</strong> ${item.medicineId.benefits}</p>
                <p><strong>Quantity:</strong> ${item.quantity}</p>
                <p><strong>Price:</strong> ${item.price}</p>
            </div>
        `).join('');

        return `
            <div>
                ${items}
                <p><h3>Shipping Address:</h3></p>
                <p><strong>Address:</strong> ${order.shippingAddress.address} <br> <strong>City:</strong> ${order.shippingAddress.city} <br> <strong>State:</strong> ${order.shippingAddress.state} <br> <strong>Country:</strong> ${order.shippingAddress.country} <br><strong>Pin Code:</strong>  ${order.shippingAddress.pinCode}</p>
                <p><h3>Ordered By:</h3></p>
                <p><strong>Name:</strong> ${order.medicineOrderedBy.firstName} ${order.medicineOrderedBy.lastName}</p>
                <p><strong>Email:</strong> ${order.medicineOrderedBy.email}</p>
                <p><strong>Phone Number:</strong> ${order.shippingAddress.phoneNo}</p>
                <p><strong>Total Price:</strong> ${order.totalPrice}</p>
                <p><strong>Order Status:</strong> ${order.orderStatus}</p>
                <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
        `;
    };

    // Fetch and display my order request
    const fetchMyOrders = async () => {
        try {
            showLoader();
            const response = await fetch(`${baseUrl}/api/v1/orders/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token()}`
                },
                credentials: 'include',
            });

            const data = await response.json();
            hideLoader();
            orderList.innerHTML = '';

            if (response.ok) {
                if (data.myOrders.length === 0) {
                    orderList.innerHTML = `<p>You have not place any orders yet.</p>`;
                }

                data.myOrders.forEach(order => {
                    const li = document.createElement('li');
                    li.classList.add('list-item');
                    li.innerHTML = createOrderList(order);
                    orderList.appendChild(li);
                });

                showNotification(data.message);
            } else {
                showNotification(data.message);
                console.error('Failed to fetch orders:', data.message);
            }
        } catch (error) {
            showNotification(error.message);
            console.error('Error fetching orders:', error);
        }
    };

    // Fetch medicines
    const fetchMedicines = async () => {
        try {
            showLoader();
            const response = await fetch(`${baseUrl}/api/v1/admin/medicines`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token()}`
                },
                credentials: 'include',
            });

            const data = await response.json();
            hideLoader();

            if (response.ok) {
                medicineSelect.innerHTML = `<option value="" disabled selected>Select Medicine</option>` +
                    data.result.map(medicine =>
                        `<option value="${medicine._id}">${medicine.nameOfMedicine}</option>`
                    ).join('');

                medicineSelect.addEventListener('change', () => {
                    const selectedMedicine = data.result.find(medicine => medicine._id === medicineSelect.value);
                    displayMedicineDetails(selectedMedicine);
                });
            } else {
                showNotification(data.message);
            }
        } catch (error) {
            console.error('Error fetching medicines:', error);
        }
    };

    // Display selected medicine details
    const displayMedicineDetails = (medicine) => {

        // Function to format categories
        const formatCategories = (categories) => {
            return categories.map(category => `
            ${category.parentCategoryId.categoryName}: ${category.subCategoryName}
        `).join(',');
        };

        if (medicine) {
            medicineCategory.textContent = `${formatCategories(medicine.category)}`;
            medicineId.textContent = `${medicine.medicineId}`;
            medicineType.textContent = `${medicine.type.parentTypeId.typeName}: ${medicine.type.subTypeName}`;
            medicineUses.textContent = medicine.uses;
            medicineBenefits.textContent = medicine.benefits;
            medicinePrice.textContent = medicine.price;
            medicineDetails.style.display = 'block';
        } else {
            medicineDetails.style.display = 'none';
        }
    };

    // Clear medicine details
    const clearMedicineDetails = () => {
        medicineSelect.selectedIndex = 0;
        medicineCategory.textContent = '';
        medicineType.textContent = '';
        medicineUses.textContent = '';
        medicineBenefits.textContent = '';
        medicinePrice.textContent = '';
        medicineDetails.style.display = 'none';
    };

    // Handle order form submission
    orderForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const state = document.getElementById('state').value;
        const country = document.getElementById('country').value;
        const pinCode = document.getElementById('pinCode').value;
        const phoneNo = document.getElementById('phoneNo').value;
        const medicineId = document.getElementById('medicine').value;
        const quantity = document.getElementById('quantity').value;

        const orderData = {
            shippingAddress: {
                address,
                city,
                state,
                country,
                pinCode,
                phoneNo
            },
            orderItems: [
                {
                    medicineId,
                    quantity
                }
            ]
        };

        try {
            showLoader();
            const response = await fetch(`${baseUrl}/api/v1/order/new`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token()}`
                },
                credentials: 'include',
                body: JSON.stringify(orderData)
            });

            const data = await response.json();
            hideLoader();

            if (response.ok) {
                showNotification(data.message);
                orderForm.reset();
                clearMedicineDetails();
            } else {
                showNotification(data.message);
            }
        } catch (error) {
            console.error('Error placing order:', error);
        }
    });
});
