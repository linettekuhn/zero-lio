import { IoMdCalendar } from "react-icons/io";
import Navbar from "../components/Navbar";
import styles from "./Reserve.module.css";
export default function Reserve() {
    // TODO: firebase
  return (
    <div className={styles.reserve}>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.header}>
          <IoMdCalendar />
          <h2>Reservar una cancha</h2>
        </div>
        <form className={styles.reserveForm} action="reserve">
          <label htmlFor="reserve-date">
            Fecha <input type="date" id="reserve-date" />
          </label>

          <label htmlFor="reserve-time">
            Hora <input type="time" id="reserve-time" />
          </label>

          <label htmlFor="reserve-cancha">
            Cancha
            <select name="cancha" id="reserve-cancha">
              <option>Baloncesto</option>
              <option>Volleyball</option>
              <option>Fútbol</option>
              <option>Béisbol</option>
            </select>
          </label>

          <button className={styles.reserveBtn}>Reservar</button>
        </form>
      </div>
    </div>
  );
}
