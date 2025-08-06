# Real-Time Chat Application (RTCA) 🚀

A modern, feature-rich real-time chat application built with React, Firebase, and Framer Motion. This application provides a smooth, interactive messaging experience with real-time updates and beautiful animations.

![RTCA Preview](preview.png)

## ✨ Features

### 🔐 Authentication & User Management
- Email-based authentication
- Google authentication support (coming soon)
- Customizable user profiles:
  - Display name
  - Profile picture
  - About section
  - Contact information

### 💬 Chat Features
- Real-time messaging with instant updates
- Typing indicators
- Message status tracking (sent, delivered, read)
- Message management:
  - Edit messages
  - Delete messages
- Contact list with search functionality
- Responsive design for all devices

### 🎨 UI/UX Features
- Smooth animations with Framer Motion
- Modern glass-morphism design
- Dark theme with neutral color scheme
- Real-time status indicators
- Loading animations
- Toast notifications for user feedback

## 🛠️ Technology Stack

- **Frontend:** React with Vite
- **State Management:** Zustand
- **Database:** Firebase Realtime Database
- **Authentication:** Firebase Auth
- **Styling:** TailwindCSS
- **Animations:** Framer Motion
- **Notifications:** React Hot Toast

## 📦 Project Structure
```bash
src/
├── components/         # Reusable UI components
├── config/            # Firebase configuration
├── hooks/             # Custom React hooks
├── pages/             # Main application pages
├── services/          # API and service layers
└── store/             # State management
```

## 🚀 Getting Started

1. **Clone the repository**
```bash
git clone [repository-url]
cd RTCA
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Firebase**
- Create a Firebase project
- Enable Authentication and Realtime Database
- Create `.env` file with your Firebase config:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_DATABASE_URL=your_database_url
```

4. **Start development server**
```bash
npm run dev
```

## 🔒 Security Features

- Protected routes with authentication
- Secure Firebase rules
- Input validation
- Secure user sessions

## 🎯 Upcoming Features

- Google Authentication
- File sharing
- Voice messages
- Group chats
- Push notifications
- Message reactions

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request


