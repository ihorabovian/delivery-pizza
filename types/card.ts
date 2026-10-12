// The backend keeps only the last 4 digits of a saved card
export type SavedCard = {
  _id: string;
  phone: string;
  panMasked: string;
  expiry: string;
};
