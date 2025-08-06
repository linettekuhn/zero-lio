import Navbar from "../components/Navbar";
import styles from "./Reserve.module.css";
export default function Reserve() {
  return (
    <div className={styles.reserve}>
      <Navbar />
      <div className={styles.content}></div>
    </div>
  );
}
