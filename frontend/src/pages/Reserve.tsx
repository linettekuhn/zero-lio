import Navbar from "../components/Navbar";
import styles from "./Reserve.module.css";
import { useEffect, useState } from "react";
import type { Place, Reservation } from "../types";
import { fetchSavedCanchas, saveReservations } from "../api/firestore";
import { toast, ToastContainer } from "react-toastify";
import { IoMdCalendar } from "react-icons/io";
import ReservationSuccess from "../components/ReservationSuccess";
import { useNavigate } from "react-router";
import LoadingScreen from "../components/LoadingScreen";

export default function Reserve() {
  const [dateTime, setDateTime] = useState("");
  const [courtType, setCourtType] = useState("");
  const [address, setAddress] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [reservation, setReservation] = useState<Reservation | null>(null);
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

  const sports = [
    ...new Set(savedCanchas.map((cancha: Place) => cancha.sport)),
  ];

  const handleReserveButton = async () => {
    const formattedDateTime = new Date(dateTime);

    const reservation: Reservation = {
      datetime: formattedDateTime,
      courtType: courtType,
      location: address,
    };

    try {
      setLoading(true);
      setReservation(reservation);
      await saveReservations([reservation], []);
      setShowSuccess(true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
    setLoading(false);
  };

  return (
    <>
      {isLoading ? <LoadingScreen /> : null}
      <div className={styles.reserve}>
        {showSuccess && (
          <div
            className={styles.backdrop}
            onClick={() => {
              setShowSuccess(false);
              navigate("/canchas");
            }}
          ></div>
        )}
        {reservation
          ? showSuccess && <ReservationSuccess reservation={reservation} />
          : null}
        <Navbar />
        <div className={styles.content}>
          <div className={styles.header}>
            <IoMdCalendar />
            <h2>Reserva tus canchas favoritas</h2>
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
                required
              />
            </label>

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

                  if (cancha && cancha.sport) {
                    setCourtType(cancha.sport);
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
                {savedCanchas
                  .filter((cancha) =>
                    courtType ? cancha.sport === courtType : true
                  )
                  .map((cancha) => (
                    <option key={cancha.id} value={cancha.formattedAddress} />
                  ))}
              </datalist>
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
                required
              >
                <option value="" disabled>
                  Selecciona una cancha
                </option>
                {address
                  ? savedCanchas
                      .filter((cancha) => cancha.formattedAddress === address)
                      .map((cancha) =>
                        cancha.sport ? (
                          <option key={cancha.id} value={cancha.sport}>
                            {cancha.sport.charAt(0).toUpperCase() +
                              cancha.sport.slice(1)}
                          </option>
                        ) : null
                      )
                  : sports.map((sport) => (
                      <option key={sport}>
                        {sport
                          ? sport?.charAt(0).toUpperCase() + sport?.slice(1)
                          : null}
                      </option>
                    ))}
              </select>
            </label>

            <button className={styles.reserveBtn} type="submit">
              Reservar
            </button>
          </form>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}
