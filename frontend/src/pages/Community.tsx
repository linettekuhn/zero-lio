import { IoPeople } from "react-icons/io5";
import Navbar from "../components/Navbar";
import styles from "./Community.module.css";
import { toast, ToastContainer } from "react-toastify";
import { fetchAllComments } from "../api/firestore";
import { useEffect, useState } from "react";
import type { Comment } from "../types";
import Review from "../components/Review";

export default function Community() {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const data = await fetchAllComments();
        const comments = data.map((comment) => ({
          ...comment,
          date: new Date(comment.date),
        }));
        console.log(comments);
        setComments(comments);
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    };
    loadComments();
  }, []);
  return (
    <div className={styles.community}>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.header}>
          <IoPeople />
          <h2>Comunidad</h2>
        </div>
        <div className={styles.comments}>
          {comments.length > 0
            ? comments.map((comment) => (
                <Review key={comment.id} comment={comment} />
              ))
            : null}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
