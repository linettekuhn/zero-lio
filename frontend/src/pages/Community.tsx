import Navbar from "../components/Navbar";
import styles from "./Community.module.css";

export default function Community() {
  return (
    <div className={styles.community}>
      <Navbar />
      <div className={styles.content}></div>
    </div>
  );
}
