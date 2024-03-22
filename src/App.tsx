// App.jsx

import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
//import AR_Cards from './pages/AR_Cards/AR_Cards';
import Login from './pages/login/Login';
import Home from './pages/home/Home';
import EditUpdatePage from './pages/home/EditUpdatePage';
import Signup from './pages/signup/Signup';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { AuthContextProvider } from './context/AuthContext';
import { useAuthContext } from './hooks/useAuthContext';
import { Row, Col } from 'antd';

function App() {
  const { authIsReady, user } = useAuthContext();

  if (!authIsReady) {
    // You may choose to show a loading indicator while authentication is in progress
    return <div>Loading...</div>;
  }

  // We don't want to show any of the component tree until auth is ready in AuthContext.js file
  return (
    <div className="App">
      {authIsReady && (
        <Row
          gutter={0}
          justify="center"
          align="middle"
          style={{
            backgroundColor: "#e31515",
            border: "9px solid #ccc",
            borderRadius: "5px",
            boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Col
            span={24}
            xs={24}
            sm={24}
            md={24}
            style={{
              backgroundColor: "#ddff00",
              border: "13px solid #ccc",
              borderRadius: "5px",
              boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Router>
              <Navbar />
              {user && (
                <Sidebar
                  
                 
                />
              )}
              <Routes>
                <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
                <Route path="/signup" element={<Signup />} />
                {user && <Route path="/" element={<Dashboard />} />}
                {user && <Route path="/form" element={<Home />} />}
                {user && <Route path="/edit/:id" element={<EditUpdatePage />} />}
                {/* Show Home component only if user is authenticated */}
                {!user && <Route path="*" element={<Navigate to="/login" />} />}
                {/* Redirect to login if user us n ot authenticated */}
              </Routes>
            </Router>
          </Col>
        </Row>
      )}
    </div>
  );
}

export default function AppStart() {
  return (
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  );
}
