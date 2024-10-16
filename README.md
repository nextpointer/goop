

# Goop

Goop is a real-time chat application with a frontend built using React and a backend using Express, Socket.IO, and Bun runtime. This documentation provides instructions for setting up both the frontend and backend of the project.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Installation](#installation)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Accessing the Application](#accessing-the-application)
- [Common Issues](#common-issues)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Make sure you have the following installed:
- **Bun**: A JavaScript runtime. [Installation Guide](https://bun.sh/docs/install)
- **Git**: For cloning the repository.

## Project Structure

The Goop project has two main parts:
- **Frontend**: React-based user interface
- **Backend**: Express and Socket.IO server for real-time communication

The project structure looks like this:
```
/goop
├── /frontend   # React-based frontend code
└── /backend    # Express and Socket.IO backend code
```

## Installation

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install the dependencies using Bun:
   ```bash
   bun install
   ```

3. Start the development server:
   ```bash
   bun run dev
   ```
   The frontend should now be running at `http://localhost:5173`.

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd ../backend
   ```

2. Install the dependencies using Bun:
   ```bash
   bun install
   ```

3. Start the backend server with hot-reloading:
   ```bash
   bun run --hot src/index.ts
   ```
   This command runs the backend server with automatic hot-reloading enabled. The server should start on `http://localhost:3000`.

## Accessing the Application

Visit the following URL in your web browser to access the Goop application:

```
http://localhost:5173
```

You can now use Goop to join chat rooms, send messages, and interact in real-time.

## Common Issues

- **Port Conflicts**: If you encounter port conflicts, change the port number in your backend or frontend configuration.
- **CORS Errors**: Ensure that your backend CORS settings allow requests from the frontend's origin.

## Contributing

We welcome contributions to improve Goop! To contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License.
```

This formatted `README.md` file provides clear instructions for setting up and running both the frontend and backend of the Goop application using Bun. You can paste this directly into your project's `README.md` file. Let me know if you need any more details!
