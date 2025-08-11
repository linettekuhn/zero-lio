import { IoCheckmarkCircle } from "react-icons/io5";
import { IoBasketballOutline } from "react-icons/io5";
import { IoIosCalendar } from "react-icons/io";
import { IoTimeOutline } from "react-icons/io5";
import { IoPersonOutline } from "react-icons/io5";
import { IoMailOutline } from "react-icons/io5";
import type { Reservation } from "../types";
import styles from "./ReservationSuccess.module.css";
import { auth } from "../api/authentication";

export default function ReservationSuccess({
  reservation,
}: {
  reservation: Reservation;
}) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const user = auth.currentUser;
  return (
    <div className={styles.successWrapper}>
      <div className={styles.successHeader}>
        <IoCheckmarkCircle />
        <h2>¡Cancha reservada con éxito!</h2>
        <p>Tu reserva ha sido registrada correctamente.</p>
      </div>
      <div className={styles.successDetails}>
        <p>
          <span className="bold">Detalles de la reserva:</span>
        </p>
        <div className={styles.successDetail}>
          <IoBasketballOutline />
          <p>
            <span className="bold">Cancha:</span> {reservation.courtType}
          </p>
        </div>
        <div className={styles.successDetail}>
          <IoIosCalendar />
          <p>
            <span className="bold">Fecha:</span>{" "}
            {reservation.datetime.toLocaleDateString("es-ES", options)}
          </p>
        </div>
        <div className={styles.successDetail}>
          <IoTimeOutline />
          <p>
            <span className="bold">Hora:</span>{" "}
            {reservation.datetime.toLocaleTimeString()}
          </p>
        </div>
        <div className={styles.successDetail}>
          <IoPersonOutline />{" "}
          <p>
            <span className="bold">Reservado a nombre de:</span> <br />
            {user?.displayName}
          </p>
        </div>
        <div className={styles.successDetail}>
          <IoMailOutline />
          <p>
            Se ha enviado un correo de confirmación con los detalles a tu
            dirección registrada.
          </p>
        </div>
      </div>
    </div>
  );
}
