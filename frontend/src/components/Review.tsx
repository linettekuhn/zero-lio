import type { Comment } from "../types";
import styles from "./Review.module.css";
import { IoIosStar } from "react-icons/io";
import { IoIosStarOutline } from "react-icons/io";

type Props = {
  comment: Comment;
};

export default function Review({ comment }: Props) {
  const { displayName, date, stars, text } = comment;
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  function renderStars(starsCount: number) {
    const starsArr = [];
    for (let i = 0; i < 5; i++) {
      if (i < starsCount) {
        starsArr.push(<IoIosStar key={i} />);
      } else {
        starsArr.push(<IoIosStarOutline key={i} />);
      }
    }
    return starsArr;
  }
  return (
    <div className={styles.review}>
      <div className={styles.user}>
        <div className={styles.info}>
          <h4 className={styles.name}>{displayName}</h4>
          <p className={styles.date}>
            {date.toLocaleDateString("es-ES", options)}
          </p>
        </div>
      </div>
      <p className={styles.commentText}>{text}</p>
      <div className={styles.stars}>{renderStars(stars)}</div>
    </div>
  );
}
