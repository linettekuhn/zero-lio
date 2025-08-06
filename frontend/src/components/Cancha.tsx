import { IoIosPin } from "react-icons/io";
import styles from "./Canchas.module.css";

export default function Cancha({ place }: { place: google.maps.places.Place }) {
  // TODO: correct distance
  return (
    <div className={styles.canchaWrapper}>
      <img src="/no-image-available-vector.jpg" alt="Imagen no encontrada" />
      <div className={styles.canchaInfo}>
        <h3 className={styles.name}>{place.displayName}</h3>
        <p className={styles.type}>{place.primaryTypeDisplayName}</p>
        <p className={styles.address}>{place.formattedAddress}</p>
        <p className={styles.distance}>
          <IoIosPin /> 3.2 km
        </p>
      </div>
    </div>
  );
}
