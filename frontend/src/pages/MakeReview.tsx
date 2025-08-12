import { useState } from "react";
import Navbar from "../components/Navbar";
import styles from "./MakeReview.module.css";
import { IoIosStar, IoIosStarOutline } from "react-icons/io";
import { fetchUserInfo, postComment } from "../api/firestore";
import { toast, ToastContainer } from "react-toastify";
import { IoChatboxEllipses } from "react-icons/io5";

export default function MakeReview() {
  const [stars, setStars] = useState(0);
  const [text, setText] = useState("");

  const handleCommentButton = async () => {
    try {
      const userProfile = await fetchUserInfo();
      const now = new Date();
      const formattedDate = now.toISOString().split(".")[0];
      const id = `${userProfile.cedula}-${formattedDate}`;
      await postComment({
        id: id,
        displayName: userProfile.name + " " + userProfile.lastName,
        pfpSrc: userProfile.pfpSrc || "",
        date: now,
        stars,
        text,
      });
      toast.success("Comentario publicado");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  function renderStars(starsCount: number) {
    const starsArr = [];
    for (let i = 0; i < 5; i++) {
      const isFilled = i < starsCount;
      starsArr.push(
        <div key={i} onClick={() => setStars(i + 1)}>
          {isFilled ? <IoIosStar /> : <IoIosStarOutline />}
        </div>
      );
    }
    return starsArr;
  }
  // TODO: attach location
  return (
    <div className={styles.makeReview}>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.header}>
          <IoChatboxEllipses />
          <h2>Comentar</h2>
        </div>
        <form
          className={styles.commentForm}
          action="comment"
          onSubmit={(e) => {
            e.preventDefault();
            handleCommentButton();
          }}
        >
          <h3>Comparte tus experiencias:</h3>
          <textarea
            name="review-text"
            id="review-text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
            required
          ></textarea>
          <div className={styles.stars}>{renderStars(stars)}</div>
          <button className={styles.commentBtn} type="submit">
            Publicar Comentario
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
