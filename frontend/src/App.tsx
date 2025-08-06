import { useState } from "react";
import styles from "./App.module.css";
import { logInUser, registerUser, updateUserInfo } from "./api/authentication";
import { toast, ToastContainer } from "react-toastify";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router";
import { ImEyeBlocked, ImEye } from "react-icons/im";

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
  const [newUserFlag, setNewUserFlag] = useState(false);
  const [showPass, setShowPass] = useState(false);

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
    <div className={newUserFlag ? styles.userRegister : styles.userLogin}>
      <div className={styles.logoVertical}>
        <img src="../icons/zero_icon.png" alt="0" />
        <h1>LÍO</h1>
      </div>
      {newUserFlag ? (
        <form className={styles.authForm} action="userRegister">
          <h2>Registro</h2>
          <div className={styles.name}>
            <div className={styles.nameWrapper}>
              <p>Nombre</p>
              <div className={styles.input}>
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
            </div>
            <div className={styles.nameWrapper}>
              <p>Apellido</p>
              <div className={styles.input}>
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
          </div>
          <p>Correo Electrónico</p>
          <div className={styles.input}>
            <input
              type="email"
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
          </div>
          <p>Cédula</p>
          <div className={styles.input}>
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
          </div>
          <p>Contraseña</p>
          <div className={styles.input}>
            <input
              type={showPass ? "text" : "password"}
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
            <button
              type="button"
              className={styles.togglePassBtn}
              onClick={() => setShowPass((prev) => !prev)}
            >
              {showPass ? <ImEyeBlocked /> : <ImEye />}
            </button>
          </div>
          <div className={styles.checkbox}>
            <input name="terms" type="checkbox" required />
            <label htmlFor="terms">Acepto los términos y condiciones</label>
          </div>
          <div className={styles.buttons}>
            <button
              className="button"
              type="submit"
              onClick={handleRegisterButton}
            >
              Crear Cuenta
            </button>
            <a type="submit" onClick={handleLogInButton}>
              Login
            </a>
          </div>
        </form>
      ) : (
        <form className={styles.authForm} action="userLogin">
          <h2>Login</h2>
          <div className={styles.flexline}>
            <span>¿No tienes una cuenta aún?</span>
            <a onClick={() => setNewUserFlag(true)}>Registrate</a>
          </div>
          <div className={styles.flexline}>
            <span>¿Eres administrador?</span>
            <a>Dar click aquí</a>
          </div>
          <p>Correo Electrónico</p>
          <div className={styles.input}>
            <input
              type="email"
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
          </div>
          <p>Contraseña</p>
          <div className={styles.input}>
            <input
              type={showPass ? "text" : "password"}
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
            <button
              type="button"
              className={styles.togglePassBtn}
              onClick={() => setShowPass((prev) => !prev)}
            >
              {showPass ? <ImEyeBlocked /> : <ImEye />}
            </button>
          </div>
          <div className={styles.loginOptions}>
            <div className={styles.checkbox}>
              <input name="saveLogin" type="checkbox" />
              <label htmlFor="saveLogin">Guardar login</label>
            </div>
            <a>Olvidé mi contraseña</a>
          </div>
          <button className="button" type="submit" onClick={handleLogInButton}>
            Login
          </button>
        </form>
      )}
      <ToastContainer />
    </div>
  );
}

export default App;
