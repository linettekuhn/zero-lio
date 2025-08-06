import { Link } from "react-router";
import { IoIosArrowBack } from "react-icons/io";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav>
      <Link className={styles.backButton} to={"/canchas"}>
        <IoIosArrowBack />
      </Link>
      <div className={styles.logoHorizontal}>
        <img src="../icons/zero_icon.png" alt="0" />
        <h1>LÍO</h1>
      </div>
    </nav>
  );
}
