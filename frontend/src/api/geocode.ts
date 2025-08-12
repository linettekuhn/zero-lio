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

export async function reverseGeocode(lat: number, lng: number) {
  const url = `https://zero-lio-backend.onrender.com/api/search/reverse-geocode?lat=${encodeURIComponent(
    lat
  )}&lon=${encodeURIComponent(lng)}`;

  const response = await handleResponse(
    await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
  );

  const data = await response.json();
  return data;
}
