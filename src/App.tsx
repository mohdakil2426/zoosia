/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import { LoginView } from "./components/LoginView";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("zoosia_auth") === "true";
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("zoosia_auth", "true");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("zoosia_auth");
  };

  if (!isAuthenticated) {
    return <LoginView onLogin={handleLogin} />;
  }

  return <Dashboard onLogout={handleLogout} />;
}
