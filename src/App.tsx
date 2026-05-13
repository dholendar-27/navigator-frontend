import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import EmployeesPage from "@/pages/EmployeesPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import KnowledgeBasePage from "./pages/KnowledgeBasePage";
import Integration from "./pages/Integration";
import { Toaster } from "@/components/ui/sonner";
import type { JSX } from "react";

function App(): JSX.Element {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route
              path="/"
              element={<Navigate to="/employees" replace />}
            />

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
              path="/chat/new"
              element={<PlaceholderPage title="New Chat" />}
            />

            <Route
              path="/chat/search"
              element={<PlaceholderPage title="Search Chats" />}
            />
          </Route>
        </Routes>
      </BrowserRouter>

      <Toaster position="top-right" />
    </div>
  );
}

export default App;