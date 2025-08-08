import { IoTicket } from "react-icons/io5";
import Navbar from "../components/Navbar";
import styles from "./Reservations.module.css";
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import type { Reservation } from "../types";
import { fetchSavedReservations } from "../api/firestore";
import ReservationCard from "../components/ReservationCard";
import { Link } from "react-router";

export default function Reservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const loadSavedReservations = async () => {
      try {
        const data = await fetchSavedReservations();
        const savedReservations = data.map((reservation) => ({
          ...reservation,
          datetime: new Date(reservation.datetime),
        }));
        setReservations(savedReservations);
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    };
    loadSavedReservations();
  }, []);

  return (
    <div className={styles.main}>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.header}>
          <IoTicket />
          <h2>Mis Reservaciones</h2>
        </div>
        <div className={styles.reservations}>
          {reservations.map((reservation, i) => (
            <ReservationCard key={i} reservation={reservation} />
          ))}
        </div>
        <Link to={"/reservar"}>Reservar una cancha</Link>
      </div>
      <ToastContainer />
    </div>
  );
}
