# Next.js Boilerplate with App Router, Prisma, Next-Auth, Shadcn-UI, MongoDB, Mailtrap, and Google reCAPTCHA

Welcome to the **BlackPepper App**! This boilerplate is designed to give you a solid starting point for building modern web applications. It includes essential features and tools like Next.js with the App Router, Prisma for database management, Next-Auth for authentication, Shadcn-UI for a stunning user interface, MongoDB as the database, Mailtrap for email testing, and Google reCAPTCHA for security. Let's get you up and running quickly!

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Usage](#usage)
  - [Development](#development)
  - [Production](#production)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Next.js**: Leverage the powerful App Router for optimized routing and server-side rendering.
- **Prisma**: A modern database toolkit that makes it easy to work with databases in a type-safe way.
- **Next-Auth**: Flexible and complete authentication for Next.js applications.
- **Shadcn-UI**: Beautifully designed UI components for a seamless user experience.
- **MongoDB**: A flexible, scalable NoSQL database to store your data.
- **Mailtrap**: Email testing tool for sending and receiving test emails.
- **Google reCAPTCHA**: Protect your application from spam and abuse.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14.x or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/hafizhpratama/blackpepper-app.git
   cd blackpepper-app
   ```

2. **Install dependencies:**

   Using npm:

   ```bash
   npm install
   ```

   Or using yarn:

   ```bash
   yarn install
   ```

### Configuration

1. **Environment Variables:**

   Create a `.env` file in the root of your project and add the following variables:

   ```env
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXTAUTH_URL=http://localhost:3000

   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   DATABASE_URL=your-mongodb-connection-string
   EMAIL_SERVER_HOST=your-email-server-host
   EMAIL_SERVER_PORT=your-email-server-port
   EMAIL_SERVER_USER=your-email-server-user
   EMAIL_SERVER_PASSWORD=your-email-server-password
   EMAIL_FROM="your-email-from"
   EMAIL_BY=your-email-by
   NODE_ENV=development

   RECAPTCHA_CLIENT_ID=your-recaptcha-client-id
   RECAPTCHA_SERVER_ID=your-recaptcha-server-id
   ```

   Replace the placeholder values with your actual configuration details.

2. **Prisma Setup:**

   Generate the Prisma client:

   ```bash
   npx prisma generate
   ```

   Run the Prisma migrations:

   ```bash
   npx prisma migrate dev
   ```

## Usage

### Development

To start the development server, run:

```bash
npm run dev
```

Or with yarn:

```bash
yarn dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Production

To build and start the application for production, use:

```bash
npm run build
npm start
```

Or with yarn:

```bash
yarn build
yarn start
```

## Project Structure

Here's a brief overview of the project's structure based on Next.js's recommendations:

```
.
├── .next/                  # Next.js build output
├── node_modules/           # Node.js modules
├── public/                 # Static files such as images, fonts, etc.
├── src/                    # Source files for the project
│   ├── app/                # App directory for the App Router
│   │   ├── api/            # API routes
│   │   ├── some-page/           # Authentication configuration
│   │   ├── components/     # Reusable UI components
├── .env                    # Environment variables
├── .eslintrc.js            # ESLint configuration
├── .gitignore              # Files and directories to ignore in git
├── next.config.js          # Next.js configuration
├── package.json            # Project dependencies and scripts
└── README.md               # Project documentation
```

## Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

---

Happy coding! If you have any questions or need further assistance, feel free to open an issue or reach out to the project maintainers. Let's build something amazing together! 🚀
