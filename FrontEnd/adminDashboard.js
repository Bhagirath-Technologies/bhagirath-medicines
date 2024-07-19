document.addEventListener('DOMContentLoaded', () => {
    // const token = document.cookie.split('=')[1];
    const token = () => localStorage.getItem('token');
    if (!token()) {
        window.location.href = 'login.html';
    }

    const baseUrl = `https://bhagirathmedicinebackend-api.onrender.com`;
    // const baseUrl = `http://127.0.0.1:4000`;

    const profileButton = document.getElementById('profileButton');
    const usersButton = document.getElementById('usersButton');
    const medicinesButton = document.getElementById('medicinesButton');
    const createMedicineButton = document.getElementById('createMedicineButton');
    const createCategoryButton = document.getElementById('createCategoryButton');
    const createSubCategoryButton = document.getElementById('createSubCategoryButton');
    const createTypeButton = document.getElementById('createTypeButton');
    const createSubTypeButton = document.getElementById('createSubTypeButton');
    const orderRequestButton = document.getElementById('orderRequestButton');
    const logoutButton = document.getElementById('logoutButton');
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');

    const changePasswordForm = document.getElementById('changePasswordForm');
    const createMedicineForm = document.getElementById('createMedicineForm');
    const createCategoryForm = document.getElementById('createCategoryForm');
    const createSubCategoryForm = document.getElementById('createSubCategoryForm');

    const profileSection = document.getElementById('profileSection');
    const changePasswordSection = document.getElementById('changePasswordSection');
    const usersSection = document.getElementById('usersSection');
    const medicinesSection = document.getElementById('medicinesSection');
    const createMedicineSection = document.getElementById('createMedicineSection');
    const createCategorySection = document.getElementById('createCategorySection');
    const createSubCategorySection = document.getElementById('createSubCategorySection');
    const createTypeSection = document.getElementById('createTypeSection');
    const createSubTypeSection = document.getElementById('createSubTypeSection');
    const orderSection = document.getElementById('orderSection');
    const searchResultsSection = document.getElementById('searchResultsSection');

    const userList = document.getElementById('userList');
    const medicineList = document.getElementById('medicineList');
    const searchResults = document.getElementById('searchResults');
    const profileDetails = document.getElementById('profileDetails');
    const orderList = document.getElementById('orderList');

    // Event listeners for navigation buttons
    profileButton.addEventListener('click', () => {
        showSection('profile');
        fetchProfile();
        changePasswordSection.style.display = 'block';
    });

    usersButton.addEventListener('click', () => {
        showSection('users');
        fetchUsers();
    });

    medicinesButton.addEventListener('click', () => {
        showSection('medicines');
        fetchMedicines();
    });

    createMedicineButton.addEventListener('click', () => {
        showSection('createMedicine');
        fetchCategory();
        fetchTypes();
    });

    createCategoryButton.addEventListener('click', () => {
        showSection('createCategory');
    });

    createSubCategoryButton.addEventListener('click', () => {
        showSection('createSubCategory');
        populateParentCategories();
    });

    createTypeButton.addEventListener('click', () => {
        showSection('createType');
    });

    createSubTypeButton.addEventListener('click', () => {
        showSection('createSubType');
        populateParentTypes();
    });

    orderRequestButton.addEventListener('click', () => {
        showSection('orders');
        fetchOrders();
    });

    searchButton.addEventListener('click', () => {
        performSearch();
    });

    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form submission or other default actions
            performSearch();
        }
    });

    logoutButton.addEventListener('click', () => {
        // document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        localStorage.removeItem('token');
        showNotification(`Logout Successful.`);
        window.location.href = 'login.html';
    });

    const showSection = (section) => {
        profileSection.style.display = section === 'profile' ? 'block' : 'none';
        usersSection.style.display = section === 'users' ? 'block' : 'none';
        medicinesSection.style.display = section === 'medicines' ? 'block' : 'none';
        createMedicineSection.style.display = section === 'createMedicine' ? 'block' : 'none';
        createCategorySection.style.display = section === 'createCategory' ? 'block' : 'none';
        createSubCategorySection.style.display = section === 'createSubCategory' ? 'block' : 'none';
        createTypeSection.style.display = section === 'createType' ? 'block' : 'none';
        createSubTypeSection.style.display = section === 'createSubType' ? 'block' : 'none';
        orderSection.style.display = section === 'orders' ? 'block' : 'none';
        searchResultsSection.style.display = section === 'searchResults' ? 'block' : 'none';
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

    // Function to create user list
    const createUserList = (user) => {
        return `
                <strong>Name:</strong> <span contenteditable="true">${user.firstName} ${user.lastName}</span><br>         
                <strong>Email:</strong> <span contenteditable="true">${user.email}</span><br>
                <strong>Contact Number:</strong> <span contenteditable="true">${user.contactNumber}</span><br>
                <strong>Address:</strong> <span contenteditable="true">${user.address}</span><br>
                <strong>Role:</strong> <span contenteditable="true">${user.role}</span><br>
                
                <button class="updateButton">Update</button>
                <button class="deleteButton">Delete</button>
                `;
    }

    // Function to create medicine list
    const createMedicineList = (medicine) => {
        // Function to format categories
        const formatCategories = (categories) => {
            return categories.map(category => `
            ${category.parentCategoryId.categoryName}: ${category.subCategoryName}
        `).join('<br>');
        };

        return `
                    <strong>Name of Medicine:</strong> <span contenteditable="true">${medicine.nameOfMedicine}</span><br>
                    <strong>Medicine ID:</strong> <span contenteditable="true">${medicine.medicineId}</span><br>
                    <strong>Categories:</strong> <span><br>${formatCategories(medicine.category)}</span><br>
                    <strong>Type:</strong> <span>${medicine.type.parentTypeId.typeName}: ${medicine.type.subTypeName}</span><br>
                    <strong>Uses:</strong> <span contenteditable="true">${medicine.uses}</span><br>
                    <strong>Safety Advice:</strong> <span contenteditable="true">${medicine.safetyAdvice}</span><br>
                    <strong>Benefits:</strong> <span contenteditable="true">${medicine.benefits}</span><br>
                    <strong>Side Effects:</strong> <span contenteditable="true">${medicine.sideEffects}</span><br>
                    <strong>Manufacturer:</strong> <span contenteditable="true">${medicine.manufacturer}</span><br>
                    <strong>Manufacturing Date:</strong> <input type="date" value="${new Date(medicine.manufacturingDate).toISOString().split('T')[0]}"><br>
                    <strong>Expiry Date:</strong> <input type="date" value="${new Date(medicine.expiryDate).toISOString().split('T')[0]}"><br>
                    <strong>Stock:</strong> <input type="number" value="${medicine.stock}"><br>
                    <strong>Description:</strong> <span contenteditable="true">${medicine.description}</span><br>
                    <strong>Dosage:</strong> <span contenteditable="true">${medicine.dosage}</span><br>
                    <strong>Price:</strong> <input type="number" value="${medicine.price}"> RS<br>
                    <strong>Created By:</strong> ${(medicine.userId ?? {}).firstName} ${(medicine.userId ?? {}).lastName}<br>

                    <button class="updateButton">Update</button>
                    <button class="deleteButton">Delete</button>
                    `;
    }

    // Perform search
    const performSearch = async () => {
        const query = searchInput.value;
        const type = document.getElementById('searchType').value;

        try {
            showLoader();
            const response = await fetch(`${baseUrl}/api/v1/admin/${type}?keyword=${query}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token()}`
                },
                credentials: 'include',
            });

            const data = await response.json();
            hideLoader();

            searchResults.innerHTML = '';
            if (response.ok) {
                if (data.result.length === 0) {
                    searchResults.innerHTML = `<p>Result not found.</p>`;
                }

                data.result.forEach(item => {
                    const div = document.createElement('div');
                    div.classList.add('list-item');
                    div.innerHTML = type === 'users' ? createUserList(item) : createMedicineList(item);
                    searchResults.appendChild(div);

                    if (type === 'users') {
                        // Add event listener to update & delete button for users
                        div.querySelector('.updateButton').addEventListener('click', () => updateUser(item._id, div, "search"));
                        div.querySelector('.deleteButton').addEventListener('click', () => deleteUser(item._id, "search"));
                    } else {
                        // Add event listener to update & delete button for medicines
                        div.querySelector('.updateButton').addEventListener('click', () => updateMedicine(item._id, div, "search"));
                        div.querySelector('.deleteButton').addEventListener('click', () => deleteMedicine(item._id, "search"));
                    }

                });
                showSection('searchResults');
            } else {
                showNotification(data.message);
                console.error('Failed to perform search:', data.message);
            }
        } catch (error) {
            console.error('Error performing search:', error);
        }
    };

    // Fetch and display profile
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
                profileDetails.innerHTML = `
                    <p><strong>Name:</strong> <span contenteditable="true" id="name">${data.user.firstName} ${data.user.lastName}</span></p>
                    <p><strong>Email:</strong> <span contenteditable="true" id="email">${data.user.email}</span></p>
                    <p><strong>Contact Number:</strong> <span contenteditable="true" id="contactNumber">${data.user.contactNumber}</span></p>
                    <p><strong>Address:</strong> <span contenteditable="true" id="address">${data.user.address}</span></p>
                `;
            } else {
                showNotification(data.message);
                console.error('Failed to fetch profile:', data.message);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    // Update profile
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
                showNotification(data.message);
                fetchProfile();
            } else {
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

    // Fetch and display all users
    const fetchUsers = async () => {
        try {
            showLoader();
            const response = await fetch(`${baseUrl}/api/v1/admin/users`, {
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
                userList.innerHTML = '';
                data.result.forEach(user => {
                    const li = document.createElement('li');
                    li.classList.add('list-item');
                    li.innerHTML = createUserList(user);
                    userList.appendChild(li);

                    // Add event listener to update button
                    li.querySelector('.updateButton').addEventListener('click', () => updateUser(user._id, li));
                    li.querySelector('.deleteButton').addEventListener('click', () => deleteUser(user._id));
                });
            } else {
                showNotification(data.message);
                console.error('Failed to fetch users:', data.message);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    // Update User
    const updateUser = async (userId, userItem, callBy) => {
        const updatedUser = {
            firstName: userItem.querySelector('span[contenteditable="true"]').textContent.split(' ')[0],
            lastName: userItem.querySelector('span[contenteditable="true"]').textContent.split(' ')[1],
            email: userItem.querySelectorAll('span[contenteditable="true"]')[1].textContent,
            contactNumber: userItem.querySelectorAll('span[contenteditable="true"]')[2].textContent,
            address: userItem.querySelectorAll('span[contenteditable="true"]')[3].textContent,
            role: userItem.querySelectorAll('span[contenteditable="true"]')[4].textContent,
        };

        try {
            showLoader();
            const response = await fetch(`${baseUrl}/api/v1/admin/user/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token()}`
                },
                credentials: 'include',
                body: JSON.stringify(updatedUser)
            });

            const data = await response.json();
            hideLoader();

            if (response.ok) {
                showNotification(data.message);
                if (callBy) {
                    performSearch();
                } else {
                    fetchUsers();
                }
            } else {
                showNotification(data.message);
                console.error('Failed to update user:', data.message);
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    // Delete User
    const deleteUser = async (userId, callBy) => {
        try {
            showLoader();
            const response = await fetch(`${baseUrl}/api/v1/admin/user/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token()}`
                },
                credentials: 'include',
            });

            const data = await response.json();
            hideLoader();

            if (response.ok) {
                showNotification(data.message);
                if (callBy) {
                    performSearch();
                } else {
                    fetchUsers();
                }
            } else {
                showNotification(data.message);
                console.error('Failed to delete user:', data.message);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    // Fetching Medicine Types
    const typeSelect = document.getElementById('type');
    const fetchTypes = async () => {
        try {
            showLoader();
            const response = await fetch(`${baseUrl}/api/v1/types`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token()}`,
                },
                credentials: 'include',
            });

            const data = await response.json();
            hideLoader();

            if (response.ok) {
                typeSelect.innerHTML = `<option value="" disabled selected>Select Type</option>` +
                    data.result.map(types =>
                        `<option value="${types._id}">${types.typeName}</option>`,
                    ).join('');
            } else {
                showNotification(data.message);
            }
        }
        catch (err) {
            console.error('Error fetching types:', err);
        }
    };

    // Fetching Medicine SubTypes
    const subTypeSelect = document.getElementById('subType');
    typeSelect.addEventListener('change', async () => {

        if (!typeSelect.value) {
            showNotification(`No type ID found.`);
            return;
        }

        try {
            showLoader();
            const response = await fetch(`${baseUrl}/api/v1/subType/${typeSelect.value}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token()}`,
                },
                credentials: 'include',
            });

            const data = await response.json();
            hideLoader();
            if (response.ok) {
                subTypeSelect.innerHTML = '';
                subTypeSelect.innerHTML = `<option value="" disabled selected>Select SubType</option>` +
                    data.result.map(subType =>
                        `<option value="${subType._id}">${subType.subTypeName}</option>`
                    ).join('');
            } else {
                showNotification(data.message);
            }
        } catch (error) {
            console.error('Error fetching subtypes:', error);
        }
    });

    // Fetching Medicine Category
    const categorySelect = document.querySelector('.category-select');
    const fetchCategory = async () => {
        try {
            showLoader();
            const response = await fetch(`${baseUrl}/api/v1/categories`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token()}`,
                },
                credentials: 'include',
            });

            const data = await response.json();
            hideLoader();

            if (response.ok) {
                categorySelect.innerHTML = `<option value="" disabled selected>Select Category</option>` +
                    data.result.map(categories =>
                        `<option value="${categories._id}">${categories.categoryName}</option>`,
                    ).join('');
            } else {
                showNotification(data.message);
            }
        }
        catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    // Fetching Medicine SubCategory
    const subCategorySelect = document.querySelector('.subcategory-select');
    categorySelect.addEventListener('change', async () => {

        if (!categorySelect.value) {
            showNotification(`No category ID found.`);
            return;
        }

        try {
            showLoader();
            const response = await fetch(`${baseUrl}/api/v1/subCategories/${categorySelect.value}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token()}`,
                },
                credentials: 'include',
            });

            const data = await response.json();
            hideLoader();
            if (response.ok) {
                subCategorySelect.innerHTML = '';
                subCategorySelect.innerHTML = `<option value="" disabled selected>Select SubCategory</option>` +
                    data.result.map(subCategory =>
                        `<option value="${subCategory._id}">${subCategory.subCategoryName}</option>`
                    ).join('');
            } else {
                showNotification(data.message);
            }
        } catch (error) {
            console.error('Error fetching subcategory:', error);
        }
    });

    // Function to fetch categories
    const fetchCategories = async () => {
        try {
            showLoader();
            const response = await fetch(`${baseUrl}/api/v1/categories`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token()}`,
                },
                credentials: 'include',
            });

            const data = await response.json();
            hideLoader();

            if (response.ok) {
                return data.result.map(category => ({
                    id: category._id,
                    name: category.categoryName
                }));
            } else {
                showNotification(data.message);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    };

    // Function to fetch subcategories for a category ID
    const fetchSubcategories = async (categoryId) => {
        try {
            showLoader();
            const response = await fetch(`${baseUrl}/api/v1/subCategories/${categoryId}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token()}`,
                },
                credentials: 'include',
            });

            const data = await response.json();
            hideLoader();

            if (response.ok) {
                return data.result.map(subCategory => ({
                    id: subCategory._id,
                    name: subCategory.subCategoryName
                }));
            } else {
                showNotification(data.message);
            }
        } catch (error) {
            console.error('Error fetching subcategories:', error);
            return [];
        }
    };

    // Function to populate categories into a select element
    const populateCategories = async (categorySelect) => {
        const categories = await fetchCategories();
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    };

    // Function to handle category change event
    const handleCategoryChange = (categorySelect, subCategorySelect) => {
        categorySelect.addEventListener('change', async () => {
            subCategorySelect.innerHTML = ''; // Clear previous options
            subCategorySelect.innerHTML = `<option value="" disabled selected>Select SubCategory</option>`
            const categoryId = categorySelect.value;
            if (!categoryId) {
                showNotification(`No category ID found.`);
                return;
            }

            const subcategories = await fetchSubcategories(categoryId);
            subcategories.forEach(subcategory => {
                const option = document.createElement('option');
                option.value = subcategory.id;
                option.textContent = subcategory.name;
                subCategorySelect.appendChild(option);
            });
        });
    };

    // Function to add a new category input dynamically
    const addCategoryInput = async () => {
        const categoryInputs = document.getElementById('categoryInputs');

        // Clone the template of category input
        const categoryInputTemplate = document.querySelector('.category-input');
        const newCategoryInput = categoryInputTemplate.cloneNode(true);

        // Clear options from cloned select elements
        const categorySelect = newCategoryInput.querySelector('.category-select');
        const subCategorySelect = newCategoryInput.querySelector('.subcategory-select');
        categorySelect.innerHTML = '<option value="" disabled selected>Select Category</option>';
        subCategorySelect.innerHTML = '<option value="" disabled selected>Select SubCategory</option>';

        categoryInputs.appendChild(newCategoryInput);

        // Fetch categories for the new category select
        await populateCategories(categorySelect);
        handleCategoryChange(categorySelect, subCategorySelect);

        // Add event listener to remove category input
        const removeButton = newCategoryInput.querySelector('.remove-category');
        removeButton.addEventListener('click', () => {
            categoryInputs.removeChild(newCategoryInput);
        });
    };

    // Event listener for adding a new category input
    const addCategoryButton = document.getElementById('addCategory');
    addCategoryButton.addEventListener('click', addCategoryInput);

    // Create Medicine
    createMedicineForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const categoryInputs = document.querySelectorAll('.category-input');
        const categories = Array.from(categoryInputs).map(input => {
            const subCategorySelect = input.querySelector('.subcategory-select');

            return {
                // categoryId: categorySelect.value,
                // subCategoryId: subCategorySelect.value
                _id: subCategorySelect.value
            };
        });

        const formData = new FormData(createMedicineForm);
        // formData.forEach((value, key) => formData[key] = value);

        const formObj = {
            nameOfMedicine: formData.get('nameOfMedicine'),
            medicineId: formData.get('medicineId'),
            category: categories,
            type: formData.get('subType'),
            uses: formData.get('uses'),
            safetyAdvice: formData.get('safetyAdvice'),
            benefits: formData.get('benefits'),
            sideEffects: formData.get('sideEffects'),
            manufacturer: formData.get('manufacturer'),
            manufacturingDate: formData.get('manufacturingDate'),
            expiryDate: formData.get('expiryDate'),
            stock: formData.get('stock'),
            description: formData.get('description'),
            dosage: formData.get('dosage'),
            price: formData.get('price'),
        };

        try {
            showLoader();
            const response = await fetch(`${baseUrl}/api/v1/admin/medicines/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token()}`
                },
                credentials: 'include',
                body: JSON.stringify(formObj),
            });

            const data = await response.json();
            hideLoader();
            if (response.ok) {
                showNotification(data.message);
                createMedicineForm.reset();
            } else {
                showNotification(data.message);
            }
        } catch (error) {
            console.error('Error creating medicine:', error);
            alert('An error occurred while sending the message. Please try again.');
        }
    });

    // Fetch and display all medicines
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
            medicineList.innerHTML = '';
            if (response.ok) {
                if (data.result.length === 0) {
                    medicineList.innerHTML = `<p>No medicines found.</p>`;
                }

                data.result.forEach(medicine => {
                    const li = document.createElement('li');
                    li.classList.add('list-item');
                    li.innerHTML = createMedicineList(medicine)

                    medicineList.appendChild(li);

                    // Add event listener to update button
                    li.querySelector('.updateButton').addEventListener('click', () => updateMedicine(medicine._id, li));
                    li.querySelector('.deleteButton').addEventListener('click', () => deleteMedicine(medicine._id));
                });
            } else {
                showNotification(data.message);
                console.error('Failed to fetch medicines:', data.message);
            }
        } catch (error) {
            console.error('Error fetching medicines:', error);
        }
    };

    // Update Medicines
    const updateMedicine = async (medicineId, medicineItem, callBy) => {
        const updatedMedicine = {
            nameOfMedicine: medicineItem.querySelector('span[contenteditable="true"]').textContent,
            medicineId: medicineItem.querySelectorAll('span[contenteditable="true"]')[1].textContent,
            // category: medicineItem.querySelectorAll('span[contenteditable="true"]')[2].textContent,
            // type: medicineItem.querySelectorAll('span[contenteditable="true"]')[3].textContent,
            uses: medicineItem.querySelectorAll('span[contenteditable="true"]')[2].textContent,
            safetyAdvice: medicineItem.querySelectorAll('span[contenteditable="true"]')[3].textContent,
            benefits: medicineItem.querySelectorAll('span[contenteditable="true"]')[4].textContent,
            sideEffects: medicineItem.querySelectorAll('span[contenteditable="true"]')[5].textContent,
            manufacturer: medicineItem.querySelectorAll('span[contenteditable="true"]')[6].textContent,
            manufacturingDate: medicineItem.querySelectorAll('input[type="date"]')[0].value,
            expiryDate: medicineItem.querySelectorAll('input[type="date"]')[1].value,
            stock: medicineItem.querySelectorAll('input[type="number"]')[0].value,
            description: medicineItem.querySelectorAll('span[contenteditable="true"]')[7].textContent,
            dosage: medicineItem.querySelectorAll('span[contenteditable="true"]')[8].textContent,
            price: medicineItem.querySelectorAll('input[type="number"]')[1].value,
        };

        try {
            showLoader();
            const response = await fetch(`${baseUrl}/api/v1/admin/medicines/${medicineId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token()}`
                },
                credentials: 'include',
                body: JSON.stringify(updatedMedicine)
            });

            const data = await response.json();
            hideLoader();

            if (response.ok) {
                showNotification(data.message);
                if (callBy) {
                    performSearch();
                } else {
                    fetchMedicines();
                }
            } else {
                showNotification(data.message);
                console.error('Failed to update medicine:', data.message);
            }
        } catch (error) {
            console.error('Error updating medicine:', error);
        }
    };

    // Delete Medicines
    const deleteMedicine = async (medicineId, callBy) => {
        try {
            showLoader();
            const response = await fetch(`${baseUrl}/api/v1/admin/medicines/${medicineId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token()}`
                },
                credentials: 'include',
            });

            const data = await response.json();
            hideLoader();

            if (response.ok) {
                showNotification(data.message);
                if (callBy) {
                    performSearch();
                } else {
                    fetchMedicines();
                }
            } else {
                showNotification(data.message);
                console.error('Failed to delete medicine:', data.message);
            }
        } catch (error) {
            console.error('Error deleting medicine:', error);
        }
    };

    // Create Category form submission
    createCategoryForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const categoryName = document.getElementById('categoryName').value;
        try {
            showLoader();
            const response = await fetch(`${baseUrl}/api/v1/categories/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token()}`
                },
                credentials: 'include',
                body: JSON.stringify({ categoryName }),
            });

            const data = await response.json();
            hideLoader();
            if (response.ok) {
                showNotification(data.message);
                document.getElementById('categoryName').value = '';
            } else {
                showNotification(data.message);
            }
        } catch (error) {
            console.error(`Error: ${error}`);
            showNotification(`${error.message}`);
        }
    });

    // Function to populate parent categories in the subcategory form
    const populateParentCategories = async () => {
        const parentCategorySelect = document.getElementById('parentCategoryId');
        parentCategorySelect.innerHTML = '<option value="" disabled selected>Select Category</option>';

        // Fetch categories for the new category select
        await populateCategories(parentCategorySelect);
    };

    // Create Subcategory form submission
    createSubCategoryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const parentCategoryId = document.getElementById('parentCategoryId').value;
        const subCategoryName = document.getElementById('subCategoryName').value;

        try {
            showLoader();
            const response = await fetch(`${baseUrl}/api/v1/subCategories/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token()}`
                },
                credentials: 'include',
                body: JSON.stringify({ parentCategoryId, subCategoryName }),
            });
            const data = await response.json();
            hideLoader();
            if (response.ok) {
                showNotification(data.message);
                document.getElementById('subCategoryName').value = '';
            } else {
                showNotification(data.message);
            }
        } catch (error) {
            console.error(`Error: ${error}`);
            showNotification(`${error.message}`);
        }
    });

    // Create Type form submission
    createTypeForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const typeName = document.getElementById('typeName').value;
        try {
            showLoader();
            const response = await fetch(`${baseUrl}/api/v1/types/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token()}`
                },
                credentials: 'include',
                body: JSON.stringify({ typeName }),
            });

            const data = await response.json();
            hideLoader();
            if (response.ok) {
                showNotification(data.message);
                document.getElementById('typeName').value = '';
            } else {
                showNotification(data.message);
            }
        } catch (error) {
            console.error(`Error: ${error}`);
            showNotification(`${error.message}`);
        }
    });

    const populateParentTypes = async () => {
        const parentTypeSelect = document.getElementById('parentTypeId');
        parentTypeSelect.innerHTML = '<option value="" disabled selected>Select Type</option>';

        try {
            showLoader();
            const response = await fetch(`${baseUrl}/api/v1/types`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token()}`,
                },
                credentials: 'include',
            });
            const data = await response.json();
            hideLoader();
            if (response.ok) {
                data.result.forEach(type => {
                    const option = document.createElement('option');
                    option.value = type._id;
                    option.textContent = type.typeName;
                    parentTypeSelect.appendChild(option);
                });
            } else {
                showNotification(data.message);
            }
        } catch (error) {
            console.error(`Error fetching types: ${error}`);
            showNotification(`Error fetching types: ${error.message}`);
        }
    };

    // Create SubType form submission
    createSubTypeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const parentTypeId = document.getElementById('parentTypeId').value;
        const subTypeName = document.getElementById('subTypeName').value;

        try {
            showLoader();
            const response = await fetch(`${baseUrl}/api/v1/subType/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token()}`
                },
                credentials: 'include',
                body: JSON.stringify({ parentTypeId, subTypeName }),
            });
            const data = await response.json();
            hideLoader();
            if (response.ok) {
                showNotification(data.message);
                document.getElementById('subTypeName').value = '';
            } else {
                showNotification(data.message);
            }
        } catch (error) {
            console.error(`Error: ${error}`);
            showNotification(`${error.message}`);
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

        const orderStatusOptions = ['pending', 'processed', 'shipped', 'delivered', 'cancelled'].map(status => `
            <option value="${status}" ${order.orderStatus === status ? 'selected' : ''}>${status}</option>
        `).join('');

        return `
            <div>
                ${items}
                <p><h3>Shipping Address:</h3></p>
                <p><strong>Address:</strong> ${order.shippingAddress.address} <br> <strong>City:</strong> ${order.shippingAddress.city} <br> <strong>State:</strong> ${order.shippingAddress.state} <br> <strong>Country:</strong> ${order.shippingAddress.country} <br><strong>Pin Code:</strong>  ${order.shippingAddress.pinCode}</p>
                <p><h3>Ordered By:</h3></p>
                <p><strong>Name:</strong> ${(order.medicineOrderedBy ?? {}).firstName || ''} ${(order.medicineOrderedBy ?? {}).lastName || ''}</p>
                <p><strong>Email:</strong> ${(order.medicineOrderedBy ?? {}).email}</p>
                <p><strong>Phone Number:</strong> ${order.shippingAddress.phoneNo}</p>
                <p><strong>Total Price:</strong> ${order.totalPrice}</p>
                <p><strong>Order Status:</strong> 
                <select id="orderStatus">
                    ${orderStatusOptions}
                </select>
                </p>
                <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            </div>

            <button class="updateOrderButton">Update</button>
            <button class="deleteOrderButton">Delete</button>
        `;
    };

    // Fetch and display all order request
    const fetchOrders = async () => {
        try {
            showLoader();
            const response = await fetch(`${baseUrl}/api/v1/admin/orders`, {
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
                if (data.orders.length === 0) {
                    orderList.innerHTML = `<p>Orders not found.</p>`;
                }

                data.orders.forEach(order => {
                    const li = document.createElement('li');
                    li.classList.add('list-item');
                    li.innerHTML = createOrderList(order);
                    orderList.appendChild(li);

                    // Add event listener to update button
                    li.querySelector('.updateOrderButton').addEventListener('click', () => updateOrderStatus(order._id, li.querySelector('#orderStatus').value));
                    li.querySelector('.deleteOrderButton').addEventListener('click', () => deleteOrderStatus(order._id));
                });
            } else {
                showNotification(data.message);
                console.error('Failed to fetch orders:', data.message);
            }
        } catch (error) {
            showNotification(error.message);
            console.error('Error fetching orders:', error);
        }
    };

    // Update Order request
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            showLoader();
            const response = await fetch(`${baseUrl}/api/v1/admin/order/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token()}`
                },
                credentials: 'include',
                body: JSON.stringify({ status: newStatus })
            });

            const data = await response.json();
            hideLoader();

            if (response.ok) {
                showNotification(data.message);
                fetchOrders();
            } else {
                showNotification(data.message);
            }

        } catch (error) {
            console.error(`Error updating order status: ${error}`)
        }
    }

    // Delete Order request
    const deleteOrderStatus = async (orderId) => {
        try {
            showLoader();
            const response = await fetch(`${baseUrl}/api/v1/admin/order/${orderId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token()}`
                },
                credentials: 'include',
            });

            const data = await response.json();
            hideLoader();

            if (response.ok) {
                showNotification(data.message);
                fetchOrders();
            } else {
                showNotification(data.message);
                console.error('Failed to delete medicine:', data.message);
            }
        } catch (error) {
            console.error('Error deleting medicine:', error);
        }
    };

});
