# Vintage Maroc 🎵

A full-stack e-commerce platform specializing in vintage vinyl records, audio equipment, and antiques. Built with Spring Boot and Angular.

## 🌟 Features

### For Customers
- Browse extensive collection of vinyl records, audio equipment, and antiques
- Secure user authentication and profile management
- Shopping cart functionality
- Order tracking and history
- Newsletter subscription
- Responsive design for all devices

### For Administrators
- User management dashboard
- Product catalog management
- Order management
- Marketing campaign tools
- Analytics and reporting

## 🏗️ Architecture

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.x
- **Database**: MongoDB
- **Authentication**: JWT-based authentication
- **File Storage**: GridFS for product images
- **API Documentation**: OpenAPI/Swagger
- **Containerization**: Docker & Docker Compose
- **CI/CD**: Jenkins pipeline

### Frontend (Angular)
- **Framework**: Angular 17
- **Styling**: Tailwind CSS
- **State Management**: NgRx
- **UI Components**: Custom components with modern design
- **Responsive Design**: Mobile-first approach

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 18 or higher
- MongoDB
- Docker & Docker Compose (optional)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd vintage
   ```

2. Create a `.env` file with the following variables:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRATION=86400000
   ```

3. Build and run the application:
   ```bash
   # Using Maven
   ./mvnw spring-boot:run

   # Or using Docker
   docker-compose up -d
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd vintage_front
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## 📦 Project Structure

### Backend Structure
```
vintage/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/vintage/
│   │   │       ├── config/         # Configuration classes
│   │   │       ├── controller/     # REST controllers
│   │   │       ├── model/          # Data models
│   │   │       ├── repository/     # MongoDB repositories
│   │   │       ├── service/        # Business logic
│   │   │       └── security/       # Security configuration
│   │   └── resources/
│   │       └── application.yml     # Application properties
│   └── test/                       # Test files
├── Dockerfile                      # Docker configuration
└── docker-compose.yml              # Docker Compose configuration
```

### Frontend Structure
```
vintage_front/
├── src/
│   ├── app/
│   │   ├── components/            # Reusable UI components
│   │   ├── pages/                # Page components
│   │   ├── services/             # API services
│   │   ├── store/                # NgRx store
│   │   └── guards/               # Route guards
│   ├── assets/                   # Static assets
│   └── environments/             # Environment configurations
├── package.json
└── angular.json
```

## 🔒 Security Features
- JWT-based authentication
- Role-based access control
- Password encryption
- Secure file upload
- CORS configuration
- Input validation

## 🧪 Testing
- Unit tests for both frontend and backend
- Integration tests for API endpoints
- E2E tests for critical user flows
- Test coverage reporting

## 📱 Responsive Design
- Mobile-first approach
- Breakpoints for all device sizes
- Touch-friendly interfaces
- Optimized images
- Progressive loading

## 🛠️ Development Tools
- ESLint for code linting
- Prettier for code formatting
- Husky for pre-commit hooks
- Jest for testing
- Docker for containerization

## 📈 Monitoring & Logging
- Application metrics
- Error tracking
- Performance monitoring
- User activity logging

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors
- Your Name - Initial work

## 🙏 Acknowledgments
- Spring Boot team
- Angular team
- MongoDB team
- All contributors and maintainers 