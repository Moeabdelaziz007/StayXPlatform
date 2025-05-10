import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import { UIProvider } from "@/context/UIContext";

import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Connections from "@/pages/Connections";
import Messages from "@/pages/Messages";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import UIShowcase from "@/pages/UIShowcase";
import AI from "@/pages/AI";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/profile" component={Profile} />
      <Route path="/connections" component={Connections} />
      <Route path="/messages" component={Messages} />
      <Route path="/messages/:userId" component={Messages} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/ui" component={UIShowcase} />
      <Route path="/ai" component={AI} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <AuthProvider>
          <UIProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </UIProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
