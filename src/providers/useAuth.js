// Create a new file named useAuth.js
import { useAuth } from "./AuthProvider";

export function useRoles() {
  const { user } = useAuth();

  // Add your own logic to determine user roles based on the user object
  if (user && user.role === "admin") {
    return ["admin"];
  } else if (user && user.role === "user") {
    return ["user"];
  } else {
    return [];
  }
}
