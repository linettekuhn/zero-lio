import { Link } from "react-router";
import styles from "./Menu.module.css";
import { IoMdCalendar } from "react-icons/io";
import { IoTicket } from "react-icons/io5";
import { IoChatboxEllipses } from "react-icons/io5";
import { IoIosNotifications } from "react-icons/io";
import { IoPeople } from "react-icons/io5";
import { IoIosCog } from "react-icons/io";

export default function Menu() {
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
          <IoIosNotifications />
          <Link to={"/notificaciones"}>Notificaciones</Link>
        </button>
      </div>
      <div className={styles.bottom}>
        <button className={styles.menuButton}>
          <IoChatboxEllipses />
          <Link to={"/comentar"}>Comentar</Link>
        </button>
        <button className={styles.menuButton}>
          <IoPeople />
          <Link to={"/comunidad"}>Comunidad</Link>
        </button>
        <button className={styles.menuButton}>
          <IoIosCog />
          <Link to={"/config"}>Configuración</Link>
        </button>
      </div>
    </div>
  );
}
