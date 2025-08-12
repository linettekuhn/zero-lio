import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import styles from "./MakeReview.module.css";
import { IoIosStar, IoIosStarOutline } from "react-icons/io";
import {
  fetchSavedCanchas,
  fetchUserInfo,
  postComment,
} from "../api/firestore";
import { toast, ToastContainer } from "react-toastify";
import { IoChatboxEllipses } from "react-icons/io5";
import { useNavigate } from "react-router";
import LoadingScreen from "../components/LoadingScreen";
import type { Place } from "../types";

export default function MakeReview() {
  const [stars, setStars] = useState(0);
  const [text, setText] = useState("");
  const [address, setAddress] = useState("");
  const [cancha, setCancha] = useState<Place | undefined>(undefined);
  const [savedCanchas, setSavedCanchas] = useState<Place[]>([]);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSavedCanchas = async () => {
      try {
        setLoading(true);
        const savedCanchas = await fetchSavedCanchas();
        setSavedCanchas(savedCanchas);
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
      setLoading(false);
    };
    loadSavedCanchas();
  }, []);

  const handleCommentButton = async () => {
    try {
      setLoading(true);
      const userProfile = await fetchUserInfo();
      const now = new Date();
      const formattedDate = now.toISOString().split(".")[0];
      const id = `${userProfile.name}-${formattedDate}`;
      await postComment({
        id: id,
        displayName: userProfile.name + " " + userProfile.lastName,
        pfpSrc: userProfile.pfpSrc || "",
        date: now,
        stars,
        text,
        cancha,
      });
      toast.success("Comentario publicado");
      navigate("/canchas");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
    setLoading(false);
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
  return (
    <>
      {isLoading ? <LoadingScreen /> : null}
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
            <label htmlFor="reserve-address">
              Ubicacion{" "}
              <input
                type="text"
                id="reserve-address"
                value={address}
                list="address-options"
                onChange={(e) => {
                  const selectedAddress = e.target.value;
                  setAddress(selectedAddress);

                  const cancha = savedCanchas.find(
                    (c) => c.formattedAddress === selectedAddress
                  );
                  if (cancha) {
                    setCancha(cancha);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
                required
              />
              <datalist id="address-options">
                {savedCanchas.map((cancha) => (
                  <option key={cancha.id} value={cancha.formattedAddress} />
                ))}
              </datalist>
            </label>
            <h3>Comparte tu experiencia:</h3>
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
    </>
  );
}
