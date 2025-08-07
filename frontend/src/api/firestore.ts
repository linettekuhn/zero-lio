import type { Reservation } from "../types";
import { getUserId } from "./authentication";

async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorBody = await response.text();
    let alertMessage = `HTTP error! Status: ${response.status}`;
    try {
      const errorJson = JSON.parse(errorBody);
      alertMessage = errorJson.message || alertMessage || errorJson.error;
    } catch (error: unknown) {
      console.log(error);
      alertMessage = errorBody || alertMessage;
    }
    throw new Error(`Failed to fetch: ${response.status} - ${alertMessage}`);
  }
  return response;
}

export async function saveReservations(
  newReservations: Reservation[],
  oldReservations: Reservation[]
) {
  // get userID for api call authorization
  const userID = await getUserId();
  if (!userID) {
    throw new Error("User not signed in: Cannot save recipes.");
  }

  const reservationsToUpdate = newReservations;

  const getDocId = (reservation: Reservation): string | null => {
    return `reservation-${reservation.datetime.getTime()}`;
  };

  // compute newIds
  const newIds = new Set(
    newReservations.map(getDocId).filter((id): id is string => !!id)
  );

  // filter out the old ids
  const idsToDelete: string[] = oldReservations
    .map(getDocId)
    .filter((id): id is string => !!id)
    .filter((oldId) => !newIds.has(oldId));

  // call to backend
  await handleResponse(
    await fetch("http://localhost:3000/api/reservations/store", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userID}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reservationsToUpdate, idsToDelete }),
    })
  );
}

export async function fetchSavedReservations(): Promise<Reservation[]> {
  // get userID for api call authorization
  const userID = await getUserId();
  if (!userID) {
    throw new Error("User not signed in: Cannot fetch saved reservations.");
  }

  // call to backend
  const response = await handleResponse(
    await fetch("http://localhost:3000/api/reservations/saved", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userID}`,
        "Content-Type": "application/json",
      },
    })
  );

  const reservations: Reservation[] = await response.json();
  return reservations;
}
