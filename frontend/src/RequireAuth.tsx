import { useEffect, useState, type JSX } from "react";
import { auth, onAuthStateChanged } from "./api/authentication";
import { useNavigate } from "react-router";

// wrapper for ensuring authentication when accessing routes
export default function RequireAuth({ children }: { children: JSX.Element }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // whenever the auth state changes (login/logout)
    const stopListening = onAuthStateChanged(auth, (user) => {
      // check if there is a user object and update authenticated accordingly
      if (!user) {
        setAuthenticated(false);
      } else {
        setAuthenticated(true);
      }
      setLoading(false);
    });

    return () => stopListening();
  }, []);

  useEffect(() => {
    // redirect to auth page if not authenticated
    if (!loading && !authenticated) {
      navigate("/");
    }
  }, [navigate, loading, authenticated]);

  // only return children if authenticated
  if (loading) {
    return <p>Cargando...</p>;
  } else {
    return authenticated ? children : null;
  }
}
