## Medicine API

## Overview

The Medicine API project serves as a robust platform for comprehensive management of medicine details, user accounts, and orders. It empowers users with essential functionalities, including creating and updating medicine information, user registration, role management, and efficient order handling.

## Features

**User Management**: The project includes robust functionality for creating and managing user accounts, with distinct roles assigned to users:

* **Admin** have privileged access to manage system configurations, user roles, and sensitive data.

* **Regular user** can perform standard operations within the application, such as placing orders and managing personal information.

**Medicine Information**: The Medicine API facilitates comprehensive CRUD operations for managing detailed information about medicines. These operations encompass handling essential attributes such as:

* **Name**: Identify medicines uniquely.

* **Description**: Provide detailed descriptions including usage instructions and indications.

* **Availability**: Track current stock levels and availability status.

These functionalities empower users to efficiently create, retrieve, update, and delete medicine entries as necessary, ensuring robust management of pharmaceutical data within your application.

**Order Management**: Facilitate the placement and tracking of medicine orders, including real-time status updates.

**Authentication and Authorization**: The API secures endpoints using JWT-based authentication, ensuring secure access to resources. It implements role-based access control (RBAC) distinguishing between administrators and regular users. Administrators have elevated privileges for managing users, medicines, and orders, while regular users can perform actions specific to their account, such as placing orders and managing personal information.

## Endpoints

### User Routes

#### Public Routes

* `POST /api/v1/otp`: Send OTP for verification.
* `POST /api/v1/createUser`: Create a new user.
* `POST /api/v1/login`: User login.
* `GET /api/v1/logout`: User logout.
* `POST /api/v1/password/forgot`: Send email for reset password.
* `PUT /api/v1/password/reset/:token`: Reset user's password.

#### Authenticated User Routes

* `GET /api/v1/me`: Get current user details.
* `PUT /api/v1/update/me`: Update current user's profile.
* `PUT /api/v1/password/update`: Update current user's password.

#### Admin Routes

* `GET /api/v1/admin/users`: Get all users(admin).
* `PUT /api/v1/admin/user/:id`: Update user by ID (admin).
* `DELETE /api/v1/admin/user/:id`: Delete user by ID (admin).

### Medicine Routes

#### Admin Routes for Medicine Management

* `POST /api/v1/admin/medicines/create`: Create a new medicine (admin).
* `GET /api/v1/admin/medicines`: Get all medicines (admin).
* `PUT /api/v1/admin/medicines/:id`: Update medicine by ID (admin).
* `DELETE /api/v1/admin/medicines/:id`: Delete medicine by ID (admin).

### Order Routes

#### User Routes

* `POST /api/v1/order/new`: Create a new order.
* `GET /api/v1/orders/me`: Get orders for current user.

#### Admin Routes

* `GET /api/v1/admin/orders`: Get all orders (admin).
* `PUT /api/v1/admin/order/:id`: Update order by ID (admin).
* `DELETE /api/v1/admin/order/:id`: Delete order by ID (admin).

## Getting Started

To get a local copy up and running, follow these steps:

### Prerequisites

* Node.js installed on your local environment.
* MongoDB database setup or use a cloud-based MongoDB service.

### Installation

* Clone the repository: `https://github.com/abhishekahirwar/BhagirathBiotech`
* Install dependencies: `npm install`
* Set up environment variables (see `Env Variables` for reference).
* Start the server: `node index.js`

## Env Variables
Make sure to create a .env file in the directory and add the following essential variables to use the api.

### Essential Variables

* PORT = Any Port
* MONGODB_URL = Your MongoDB connection URL

* JWT_SECRET = Secret key for JWT
* JWT_EXPIRE = JWT expiration time

* COOKIE_EXPIRE = Cookie expiration time

* SMTP_SERVICE = Your SMTP service
* SMTP_MAIL = Your SMTP email
* SMTP_PASSWORD = Your SMTP password
* SMTP_HOST = SMTP host
* SMTP_PORT = SMTP port

* CLOUDINARY_NAME = Your Cloudinary name
* CLOUDINARY_API_KEY = Your Cloudinary API key
* CLOUDINARY_API_SECRET = Your Cloudinary API secret

## Technologies Used

* **Node.js**: JavaScript runtime built on Chrome's V8 JavaScript engine for building scalable network applications.
* **Express.js**: Web framework for Node.js used for building the API endpoints.
* **MongoDB**: NoSQL database for storing data in JSON-like documents with dynamic schemas.
* **Mongoose**: MongoDB object modeling tool designed to work in an asynchronous environment.
* **dotenv**: For loading environment variables from a .env file into process.env.
* **bcrypt**: For hashing passwords securely.
* **jsonwebtoken**: For generating and verifying JSON Web Tokens (JWTs) used for authentication.
* **cors**: Middleware for enabling Cross-Origin Resource Sharing (CORS).
* **nodemailer**: Node.js module for sending emails.
* **otp-generator**: For generating One-Time Passwords (OTPs) used in email verification.

## License

* Specify the license under which your project is distributed.

## Contact

* [Website](https://www.bhagirathtechnologies.com) **Bhagirath Technologies**
* [GitHub](https://www.github.com) **Bhagirath Technologies**
* [LinkedIn](https://in.linkedin.com/company/bhagirath-technologies) **Bhagirath Technologies**

## Author

**Abhishek Ahirwar**

## Additional Resources

[Medicine API Live Deployment](https://bhagirathmedicinebackend-api.onrender.com) **Medicine API**

[Postman Documentation](https://) **Postman API Documentation**
