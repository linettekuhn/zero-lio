import Navbar from "../components/Navbar";
import styles from "./Reserve.module.css";
import { useState } from "react";
import type { Reservation } from "../types";
import { saveReservations } from "../api/firestore";
import { toast, ToastContainer } from "react-toastify";
import { IoMdCalendar } from "react-icons/io";
import ReservationSuccess from "../components/ReservationSuccess";

export default function Reserve() {
  const [dateTime, setDateTime] = useState("");
  const [courtType, setCourtType] = useState("");
  const [address, setAddress] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [reservation, setReservation] = useState<Reservation | null>(null);

  const handleReserveButton = async () => {
    const formattedDateTime = new Date(dateTime);

    const reservation: Reservation = {
      datetime: formattedDateTime,
      courtType: courtType,
      location: address,
    };

    try {
      setReservation(reservation);
      await saveReservations([reservation], []);
      setShowSuccess(true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className={styles.reserve}>
      {showSuccess && (
        <div
          className={styles.backdrop}
          onClick={() => setShowSuccess(false)}
        ></div>
      )}
      {reservation
        ? showSuccess && <ReservationSuccess reservation={reservation} />
        : null}
      <Navbar />
      <div className={styles.content}>
        <div className={styles.header}>
          <IoMdCalendar />
          <h2>Reservar una cancha</h2>
        </div>
        <form
          className={styles.reserveForm}
          action="reserve"
          onSubmit={(e) => {
            e.preventDefault();
            handleReserveButton();
          }}
        >
          <label htmlFor="reserve-datetime">
            Hora{" "}
            <input
              type="datetime-local"
              id="reserve-datetime"
              value={dateTime}
              onChange={(e) => {
                setDateTime(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
            />
          </label>

          <label htmlFor="reserve-address">
            Ubicacion{" "}
            <input
              type="text"
              id="reserve-address"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
            />
          </label>

          <label htmlFor="reserve-cancha">
            Cancha
            <select
              name="cancha"
              id="reserve-cancha"
              value={courtType}
              onChange={(e) => {
                setCourtType(e.target.value);
              }}
            >
              <option>Baloncesto</option>
              <option>Volleyball</option>
              <option>Fútbol</option>
              <option>Béisbol</option>
            </select>
          </label>

          <button className={styles.reserveBtn} type="submit">
            Reservar
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
