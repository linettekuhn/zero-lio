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
export type Profile = {
  name: string;
  lastName: string;
  pfpSrc?: string;
  cedula: string;
  email: string;
};
export type Comment = {
  id: string;
  displayName: string;
  pfpSrc: string;
  date: Date;
  stars: number;
  text: string;
  parentId?: number;
};
