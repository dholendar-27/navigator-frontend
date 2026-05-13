import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import AppLayout from "@/components/layout/AppLayout";
import EmployeesPage from "@/pages/EmployeesPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import KnowledgeBasePage from "./pages/KnowledgeBasePage";
import Integration from "./pages/Integration";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AuthInitializer from "@/components/auth/AuthInitializer";
import { Toaster } from "@/components/ui/sonner";
import type { JSX } from "react";

function AppRoutes(): JSX.Element {
    const { isAuthenticated } = useKindeAuth();

    return (
        <Routes>
            {/* Public Routes */}
            <Route
                path="/"
                element={
                    isAuthenticated ? (
                        <Navigate to="/dashboard" replace />
                    ) : (
                        <LandingPage />
                    )
                }
            />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                    <Route
                        path="/dashboard"
                        element={<PlaceholderPage title="Dashboard" />}
                    />

                    <Route
                        path="/employees"
                        element={<EmployeesPage />}
                    />

                    <Route
                        path="/category"
                        element={<PlaceholderPage title="Category" />}
                    />

                    <Route
                        path="/knowledge-base"
                        element={<KnowledgeBasePage />}
                    />

                    <Route
                        path="/integration"
                        element={<Integration />}
                    />

                    <Route
                        path="/subscription"
                        element={<PlaceholderPage title="Subscription" />}
                    />

                    <Route
                        path="/billing"
                        element={<PlaceholderPage title="Billing" />}
                    />

                    <Route
                        path="/chatnew"
                        element={<PlaceholderPage title="New Chat" />}
                    />

                    <Route
                        path="/chatsearch"
                        element={<PlaceholderPage title="Search Chats" />}
                    />
                </Route>
            </Route>

            {/* Fallback */}
            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />
        </Routes>
    );
}

function App(): JSX.Element {
    return (
        <div className="App">
            <BrowserRouter>
                <AuthInitializer />
                <AppRoutes />
            </BrowserRouter>

            <Toaster position="top-right" />
        </div>
    );
}

export default App;