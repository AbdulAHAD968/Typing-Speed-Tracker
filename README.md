# Typing Speed Tracker

**Typing Speed Tracker** is a web application designed to help users improve their typing speed and accuracy through an interactive typing test interface. Built with modern web technologies, it offers real-time performance tracking, detailed statistics, and user authentication for a personalized experience. The application is deployed at [Live](https://typeon.vercel.app/) and the source code is available at [Repositery Link](https://github.com/AbdulAHAD968/Typing-Speed-Tracker).

![Landing Page Image](./github-readme-images/landing-page.png)

---

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Features
- **Interactive Typing Test**: Users can select test durations (30, 45, 60, or 120 seconds) and type provided text to measure their words per minute (WPM) and accuracy.
- **Real-Time Feedback**: Displays live WPM, accuracy, errors, and keystrokes during the test, with visual indicators for correct and incorrect characters.
- **Performance Statistics**: Visualizes typing progress with a Recharts-based bar chart showing WPM and accuracy trends over time.
- **User Authentication**: Secure login and registration system with JWT-based authentication, allowing users to save and track their test results.
- **Responsive Design**: Fully responsive UI optimized for both desktop and mobile devices, ensuring a seamless experience across platforms.
- **Result Persistence**: Saves test results to a MongoDB database, accessible via a dedicated statistics page.
- **Progress Overview**: Displays average WPM, accuracy, and total tests completed in a clean, card-based layout.

![Register Page](./github-readme-images/register.png)

---

## Technologies
- **Frontend**:
  - Next.js 14 (React framework with App Router)
  - TypeScript (for type-safe development)
  - Recharts (for data visualization)
  - Tailwind CSS (for styling)
  - Inter font (via next/font/google for improved typography)
- **Backend**:
  - Next.js API Routes (for server-side logic)
  - MongoDB (for data storage)
  - Mongoose (for MongoDB object modeling)
  - JSON Web Tokens (JWT) for authentication
- **Deployment**:
  - Vercel (hosting platform)
- **Testing**:
  - Jest (unit testing)
  - Testing Library (React component testing)
  - Supertest (API integration testing)
- **Other**:
  - ESLint (code linting)
  - Prettier (code formatting)

---

## Project Structure
```
/workspaces/Typing-Speed-Tracker/type/
├── app/                        # Next.js app directory
│   ├── api/                    # API routes
│   │   ├── auth/               # Authentication endpoints
│   │   │   ├── login/route.ts
│   │   │   ├── register/route.ts
│   │   │   └── logout/route.ts
│   │   ├── results/            # Test result endpoints
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   └── webhook/route.ts    # Webhook for external integrations
│   ├── globals.css             # Global styles with Tailwind CSS
│   ├── layout.tsx              # Root layout component
│   ├── page.tsx                # Home page
│   ├── login/page.tsx          # Login page
│   ├── register/page.tsx       # Registration page
│   ├── typing-test/page.tsx    # Typing test page
│   └── stats/page.tsx          # Statistics page
├── lib/                        # Utility and database logic
│   ├── dbConnect.ts            # MongoDB connection setup
│   ├── models/                 # Mongoose models
│   │   ├── User.ts
│   │   └── TypingTest.ts
│   └── utils.ts                # Utility functions (e.g., JWT handling)
└── components/                 # Reusable React components
    ├── Header.tsx              # Navigation header
    ├── TypingTest.tsx          # Typing test component
    └── StatsChart.tsx          # Statistics visualization component
```

---

## Installation
To run the project locally, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/AbdulAHAD968/Typing-Speed-Tracker.git
   cd Typing-Speed-Tracker/type
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env.local` file in the `type/` directory and add the following:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   DISCORD_WEBHOOK_URL=your_channel_webhook
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

5. **Build for Production**:
   ```bash
   npm run build
   npm run start
   ```

---

## Usage
1. **Access the Application**:
   - Visit [https://typeon.vercel.app/](https://typeon.vercel.app/) or run locally.
   - Register or log in to save test results.

2. **Take a Typing Test**:
   - Navigate to the `/typing-test` page.
   - Select a test duration and start typing the provided text.
   - View real-time metrics and a performance chart upon completion.

3. **View Statistics**:
   - Go to the `/stats` page to see a chart of WPM and accuracy trends, along with a table of recent tests and overall performance metrics.

4. **Log Out**:
   - Use the logout option in the header to end your session.

![Login Page Image](./github-readme-images/login.png)

---

## Testing
The project includes comprehensive unit and integration tests to ensure reliability and correctness:

- **Unit Tests**:
  - Written with Jest and Testing Library to test individual components (`Header.tsx`, `TypingTest.tsx`, `StatsChart.tsx`).
  - Covers rendering, state updates, and user interactions (e.g., typing input, button clicks).
  - Example: Tests for `TypingTest.tsx` verify WPM and accuracy calculations, timer functionality, and chart data updates.

- **Integration Tests**:
  - Implemented with Supertest to test API endpoints (`/api/auth/*`, `/api/results/*`).
  - Validates authentication flows, result storage, and retrieval from MongoDB.
  - Example: Ensures `/api/results` returns the correct test data and handles errors appropriately.

To run tests:
```bash
npm run test
```

![Test Result Image](./github-readme-images/test-result.png)

---

## API Endpoints
The application provides the following API routes:
- **POST /api/auth/login**: Authenticates a user and returns a JWT.
- **POST /api/auth/register**: Registers a new user and returns a JWT.
- **POST /api/auth/logout**: Clears the authentication token.
- **GET /api/results**: Retrieves all test results for the authenticated user.
- **GET /api/results/[id]**: Retrieves a specific test result by ID.
- **POST /api/results**: Saves a new test result.
- **POST /api/webhook**: Handles external webhook integrations for result notifications.

---

## Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request with a detailed description of your changes.

Please ensure your code follows the project's ESLint and Prettier configurations.

![Stats Page Image](./github-readme-images/stats-page.png)

---

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact
For questions or feedback, reach out to the project maintainer:
- **GitHub**: [AbdulAHAD968](https://github.com/AbdulAHAD968)
- **Email**: Contact via GitHub issues or direct message.

---

Thank you for using Typing Speed Tracker! Start typing and track your progress today.
