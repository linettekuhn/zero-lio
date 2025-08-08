import styles from "./ReservationCard.module.css";
import type { Reservation } from "../types";

export default function ReservationCard({
  reservation,
}: {
  reservation: Reservation;
}) {
  // TODO: correct image
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return (
    <div className={styles.reservationWrapper}>
      <img src="/no-image-available-vector.jpg" alt="Imagen no encontrada" />
      <div className={styles.reservationInfo}>
        <h3 className={styles.name}>Cancha de {reservation.courtType}</h3>
        <p className={styles.date}>
          {reservation.datetime.toLocaleDateString("es-ES", options)}
        </p>
        <p className={styles.time}>{reservation.datetime.toTimeString()}</p>
        <p className={styles.address}>{reservation.location}</p>
      </div>
    </div>
  );
}
