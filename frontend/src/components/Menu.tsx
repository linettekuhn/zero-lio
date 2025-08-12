import { Link, useNavigate } from "react-router";
import styles from "./Menu.module.css";
import { IoMdCalendar } from "react-icons/io";
import { IoTicket } from "react-icons/io5";
import { IoChatboxEllipses } from "react-icons/io5";
import { IoPeople } from "react-icons/io5";
import { IoIosCog } from "react-icons/io";
import { IoMdLogOut } from "react-icons/io";
import { logOutUser } from "../api/authentication";

export default function Menu() {
  const navigate = useNavigate();
  const handleLogoutBtn = async () => {
    try {
      await logOutUser();
      navigate("/");
    } catch (error) {
      console.error("Error signing out", error);
    }
  };
  return (
    <div className={styles.menu}>
      <div className={styles.top}>
        <h1>MENÚ</h1>
        <button className={styles.menuButton}>
          <IoMdCalendar />
          <Link to={"/reservar"}>Reservar una cancha</Link>
        </button>
        <button className={styles.menuButton}>
          <IoTicket />
          <Link to={"/reservaciones"}>Mis Reservaciones</Link>
        </button>
        <button className={styles.menuButton}>
          <IoChatboxEllipses />
          <Link to={"/comentar"}>Comentar</Link>
        </button>
        <button className={styles.menuButton}>
          <IoPeople />
          <Link to={"/comunidad"}>Comunidad</Link>
        </button>
      </div>
      <div className={styles.bottom}>
        <button className={styles.menuButton}>
          <IoIosCog />
          <Link to={"/config"}>Configuración</Link>
        </button>
        <button className={styles.menuButton} onClick={handleLogoutBtn}>
          <IoMdLogOut />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
