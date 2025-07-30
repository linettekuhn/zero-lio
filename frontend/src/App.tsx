import { useState } from "react";
import styles from "./App.module.css";
import { logInUser, registerUser, updateUserInfo } from "./api/authentication";
import { toast, ToastContainer } from "react-toastify";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router";

// map firebase errors to UI error messages
const firebaseErrorMap: Record<string, string> = {
  "auth/invalid-email": "Por favor, ingresa una dirección de correo válida.",
  "auth/invalid-credential": "Correo o contraseña inválidos.",
  "auth/user-not-found": "No se encontró una cuenta con ese correo.",
  "auth/wrong-password": "Contraseña incorrecta.",
  "auth/email-already-in-use": "Ese correo ya está registrado.",
  "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
  "auth/missing-password": "Por favor, ingresa una contraseña.",
  "auth/too-many-requests": "Demasiados intentos. Intenta más tarde.",
};

function App() {
  // intialize state variables and setters
  const [cedula, setCedula] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // function to navigate to other pages
  const navigate = useNavigate();

  // button handlers
  const handleRegisterButton = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name || !lastName || !cedula) {
      toast.warning("Por favor llene todos los campos requeridos");
      return;
    }
    try {
      await registerUser(email, password);
      await updateUserInfo(`${name} ${lastName}`);
      toast.success("Usuario registrado");
      navigate("/canchas");
    } catch (error: unknown) {
      const err = error as FirebaseError;
      const message =
        firebaseErrorMap[err.code] ||
        "Ha ocurrido un error durante el registro.";
      toast.warning(message);
    }
  };

  const handleLogInButton = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning("Por favor llene todos los campos requeridos");
      return;
    }
    try {
      await logInUser(email, password);
      toast.success("Sesión inciada");
      navigate("/canchas");
    } catch (error: unknown) {
      const err = error as FirebaseError;
      const message =
        firebaseErrorMap[err.code] || "Ha ocurrido un error al iniciar sesión";
      toast.warning(message);
    }
  };

  // HTML
  return (
    <>
      <form className={styles.userLogin} action="userLogin">
        <h1>Registro</h1>
        <div className={styles.name}>
          <div className={styles.input}>
            <p>Nombre</p>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
            />
          </div>
          <div className={styles.input}>
            <p>Apellido</p>
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
            />
          </div>
        </div>
        <p>Correo Electrónico</p>
        <input
          type="text"
          name="email"
          id="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
        />
        <p>Cedula</p>
        <input
          type="text"
          name="cedula"
          id="cedula"
          placeholder="001-0000000-1"
          value={cedula}
          onChange={(e) => {
            setCedula(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
        />
        <p>Contraseña</p>
        <input
          type="password"
          name="password"
          id="userPassword"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
        />
        <div className={styles.terms}>
          <input name="terms" type="checkbox" required />
          <label htmlFor="terms">Acepto todos los terminos y condiciones</label>
        </div>
        <div className={styles.buttons}>
          <button
            className="button"
            type="submit"
            onClick={handleRegisterButton}
          >
            Crear Cuenta
          </button>
          <button className="button" type="submit" onClick={handleLogInButton}>
            Login
          </button>
        </div>
      </form>
      <ToastContainer />
    </>
  );
}

export default App;
