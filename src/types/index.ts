import { Timestamp } from "firebase/firestore";

export interface DataPaint {
  nameOfPaint: string;
  date: string;
  dateInTimestamp: Timestamp;
  userName: string;
  urlOfPaint: string;
}

export interface DataUser {
  email: string;
  role: string;
}

export const arrayStrokeType = [
  "line",
  "rectangle",
  "triangle",
  "circle",
  "ellipse",
];

export const arrayStateOfFigure = ["stroke", "fill"];
