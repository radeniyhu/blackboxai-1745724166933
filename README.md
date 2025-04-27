# Student Admission Application

This is a simple student admission web application with features including registration, login for admin and students, dashboards, and WhatsApp notification integration.

## Features

- Landing page
- Student registration with photo upload
- Admin login and dashboard to manage registered students
- Student login and dashboard to view registration details
- WhatsApp notification on successful registration (using Twilio)
- Search and delete student registrations in admin dashboard
- Session-based authentication and logout functionality

## Setup and Installation

1. Clone the repository or copy the project files.

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

Create a `.env` file in the project root (or use `.env.example` as a template):

```
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

Replace the values with your Twilio account credentials. The `TWILIO_WHATSAPP_FROM` is usually the Twilio sandbox WhatsApp number.

4. Start the server:

```bash
npm start
```

5. Access the application in your browser at:

```
http://localhost:3000
```

## Usage

- Register a new student via the registration page.
- Admin login credentials (hardcoded):
  - Username: `admin`
  - Password: `admin123`
- Students login using their NISN and birth date.
- Admin can view, search, and delete student registrations.
- Students can view their registration details.
- WhatsApp notification is sent to the student's phone number upon successful registration.

## Notes

- This application uses in-memory storage for registered students. Data will be lost when the server restarts.
- For production use, integrate a persistent database.
- Ensure your Twilio credentials are valid to enable WhatsApp notifications.

## License

This project is provided as-is without warranty.
