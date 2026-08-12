# Traffic Management System - Frontend

## React + Vite Application

Modern, responsive web interface for the Traffic Management System built with Vite for blazing fast development.

## 🎨 Features

- **Dashboard**: Real-time statistics and recent violations
- **Record Violations**: User-friendly form with validation
- **View Violations**: Searchable, filterable table
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Beautiful gradients and smooth animations

## 🛠️ Technologies

- **React 18.2.0**: UI framework
- **Vite 5.0**: Next-generation frontend tooling
- **Axios**: HTTP client for API calls
- **CSS3**: Modern styling with flexbox and grid
- **React Hooks**: useState, useEffect for state management

## 📁 Project Structure

```
frontend/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── components/
│   │   ├── AdminDashboard.jsx  # Dashboard component
│   │   ├── AdminDashboard.css
│   │   ├── ViolationForm.jsx   # Form component
│   │   ├── ViolationForm.css
│   │   ├── ViolationList.jsx   # List component
│   │   └── ViolationList.css
│   ├── services/
│   │   └── violationService.js # API service layer
│   ├── App.js                  # Main app component
│   ├── App.css                 # Main app styles
│   ├── index.js                # Entry point
│   └── index.css               # Global styles
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Start development server:**

```bash
npm run dev
# or
npm start
```

The app will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

This previews the production build locally.

## 🎯 Components Overview

### 1. App.js

Main component that:

- Manages navigation between tabs
- Handles state updates
- Provides layout structure

### 2. AdminDashboard.jsx

Dashboard component featuring:

- Statistics cards (total, helmet, overloading violations)
- Status breakdown (pending, reviewed, resolved)
- Recent violations list
- Road safety tips

### 3. ViolationForm.jsx

Form component for recording violations:

- Input validation
- Automatic overloading detection
- Real-time feedback
- Success/error messages

### 4. ViolationList.jsx

List component displaying violations:

- Search functionality
- Multiple filters (status, type)
- Inline status updates
- Delete functionality
- Responsive table design

## 🔌 API Integration

### Service Layer (violationService.js)

All API calls are centralized in `services/violationService.js`:

```javascript
import violationService from "./services/violationService";

// Record violation
await violationService.recordViolation(data);

// Get all violations
await violationService.getAllViolations();

// Update status
await violationService.updateViolationStatus(id, status);
```

### API Configuration

Backend URL is configured in `violationService.js`:

```javascript
const API_BASE_URL = "http://localhost:8080/api/violations";
```

## 🎨 Styling

### Design System

**Color Palette:**

- Primary: `#667eea` to `#764ba2` (Gradient)
- Secondary: `#1e3c72` to `#2a5298`
- Success: `#28a745`
- Warning: `#ffc107`
- Danger: `#dc3545`
- Info: `#17a2b8`

**Typography:**

- Font Family: System fonts (Apple, Segoe UI, Roboto)
- Responsive font sizes
- Clear hierarchy

**Layout:**

- Flexbox and CSS Grid
- Mobile-first responsive design
- Card-based UI components

### Responsive Breakpoints

```css
/* Tablet */
@media (max-width: 1024px) {
}

/* Mobile */
@media (max-width: 768px) {
}
```

## 💡 Key Features

### 1. Real-time Updates

- Automatic refresh after recording violations
- Dashboard updates on data changes

### 2. Form Validation

- Required field validation
- Type checking
- Automatic overloading detection when passengers > 2

### 3. Search & Filter

- Search by vehicle number
- Filter by status (Pending/Reviewed/Resolved)
- Filter by violation type (Helmet/Overloading)

### 4. Status Management

- Inline status updates
- Visual status badges
- Color-coded status indicators

### 5. User Experience

- Loading states
- Error handling
- Success messages
- Smooth animations
- Hover effects

## 🔧 Configuration

### Environment Variables

Create a `.env` file for custom configuration:

```
REACT_APP_API_URL=http://localhost:8080/api/violations
```

Update `violationService.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL;
```

## 🧪 Testing

Run tests:

````bash
This creates optimized files in the `dist` folder.

### Preview Production Build
```bash
npm run preview
````

### Deploy to Hosting

- **Netlify**: Connect GitHub repo, build command: `npm run build`, publish directory: `dist`
- **Vercel**: Import project, framework preset: Vite
- **Firebase Hosting**: `firebase deploy`, public directory: `dist`
- **AWS S3**: Upload `dist` folder contents

```bash
npm install -g serve
serve -s build
```

### Deploy to Hosting

- **Netlify**: Connect GitHub repo
- **Vercel**: Import project
- **Firebase Hosting**: `firebase deploy`
- **AWS S3**: Upload build folder

## 🐛 Troubleshooting

Vite includes a proxy configuration for API calls. Ensure backend is running on port 8080.

### API Connection Failed

1. Check if backend is running on port 8080
2. Verify API URL in `violationService.js`
3. Check browser console for errors
4. Proxy is configured in `vite.config.js`

### Build Errors

```bash
# Clear cache
rm -rf node_modules
npm cache clean --force
npm install
```

### Vite-specific Issues

- Clear Vite cache: `rm -rf node_modules/.vite`
- Restart dev server after config changes install

```

## 🎯 Best Practices

1. **Component Organization**: One component per file
2. **CSS Modules**: Each component has its own CSS file
3. **Service Layer**: Centralized API calls
4. **Error Handling**: Try-catch blocks for all API calls
5. **Loading States**: Show loading indicators
6. **Responsive Design**: Mobile-first approach

## 🔜 Future Enhancements

- [ ] React Router for proper routing
- [ ] Redux for state management
- [ ] Form validation library (Formik/React Hook Form)
- [ ] Charts and graphs (Chart.js/Recharts)
- [ ] Dark mode toggle
- [ ] Export to PDF/Excel
- [ ] Advanced filtering options
- [ ] Real-time notifications (WebSocket)

## 📚 Resources

- [React Documentation](https://react.dev/)
- [Axios Documentation](https://axios-http.com/)
- Vite provides instant HMR (Hot Module Replacement)
- Use Vite's built-in optimization for production builds
- Enable ESLint for code quality
- Use Prettier for code formatting
- Test on multiple browsers
- Optimize images and assets
- Vite automatically handles code splitting and lazy loading

## ⚡ Why Vite?

- **Lightning Fast**: Instant server start
- **Hot Module Replacement**: Updates reflect immediately
- **Optimized Build**: Uses Rollup for production builds
- **Native ES Modules**: No bundling in development
- **Better Performance**: Faster build times
- **Modern Defaults**: Out-of-the-box TypeScript, JSX, CSS support
- Use React DevTools for debugging
- Enable ESLint for code quality
- Use Prettier for code formatting
- Test on multiple browsers
- Optimize images and assets
- Implement lazy loading for better performance
```
