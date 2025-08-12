import styles from "./LoadingScreen.module.css";
import { RiLoader4Fill } from "react-icons/ri";

export default function LoadingScreen() {
  return (
    <div className={styles.loadingBackground}>
      <div className={styles.loading}>
        <RiLoader4Fill />
      </div>
    </div>
  );
}
