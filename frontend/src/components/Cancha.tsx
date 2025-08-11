import { IoIosPin } from "react-icons/io";
import styles from "./Cancha.module.css";
import type { Place } from "../types";

export default function Cancha({ place }: { place: Place }) {
  // TODO: correct distance
  return (
    <div className={styles.canchaWrapper}>
      <div className={styles.canchaInfo}>
        <h3 className={styles.name}>{place.displayName}</h3>
        <p className={styles.address}>{place.formattedAddress}</p>
        <p className={styles.distance}>
          <IoIosPin /> 3.2 km
        </p>
      </div>
    </div>
  );
}
