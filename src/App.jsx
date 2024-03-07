// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
//import AR_Cards from './pages/AR_Cards/AR_Cards';
import Login from './pages/login/Login';
import Home from './pages/home/Home';
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
        <Row gutter={0} justify="center" align="middle">
          <Col span={24}>
            <Router>
              <Navbar />
              {user && <Sidebar />}
              <Routes>
                <Route
                  path="/"
                  element={<Dashboard />}
                />
                <Route
                  path="/login"
                  element={user ? <Navigate to="/" /> : <Login />}
                />
                <Route
                  path="/signup"
                  element={user ? <Navigate to="/" /> : <Signup />}
                />
                <Route
                  path="/form" element={user ? <Home /> : <Navigate to="/login" />}
                />
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