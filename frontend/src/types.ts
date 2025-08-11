export type Reservation = {
  datetime: Date;
  courtType: string;
  location?: string;
};
export type Place = {
  id: number;
  displayName: string;
  location: {
    lat: number;
    lng: number;
  };
  formattedAddress: string;
  sport?: string;
  distanceMeters: number;
};
