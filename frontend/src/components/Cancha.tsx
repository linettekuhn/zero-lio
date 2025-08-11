import { IoIosPin } from "react-icons/io";
import styles from "./Cancha.module.css";
import type { Place } from "../types";
import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export default function Cancha({
  place,
  isSaved,
  onSave,
  onRemove,
}: {
  place: Place;
  isSaved: boolean;
  onSave: (cancha: Place) => void;
  onRemove: (cancha: Place) => void;
}) {
  const [localIsSaved, setLocalIsSaved] = useState<boolean>(!!isSaved);
  useEffect(() => {
    if (isSaved !== localIsSaved) {
      setLocalIsSaved(!!isSaved);
    }
  }, [isSaved, localIsSaved]);

  const handleSaveClick = () => {
    setLocalIsSaved(true);
    if (onSave) {
      onSave(place);
    }
  };

  const handleRemoveClick = () => {
    setLocalIsSaved(false);
    if (onRemove) {
      onRemove(place);
    }
  };
  return (
    <div className={styles.canchaWrapper}>
      {localIsSaved ? (
        <button
          className={styles.saveButton}
          onClick={handleRemoveClick}
          title="Click to remove from saved canchas"
        >
          <FaHeart />
        </button>
      ) : (
        <button
          className={styles.saveButton}
          onClick={handleSaveClick}
          title="Click to add to saved canchas"
        >
          <FaRegHeart />
        </button>
      )}
      <div className={styles.canchaInfo}>
        <h3 className={styles.name}>{place.displayName}</h3>
        <p className={styles.address}>{place.formattedAddress}</p>
        <p className={styles.distance}>
          <IoIosPin /> {(place.distanceMeters / 1000).toFixed(2)} km
        </p>
      </div>
    </div>
  );
}
