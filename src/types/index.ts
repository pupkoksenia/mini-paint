import { Timestamp } from "firebase/firestore";

export interface DataPaint {
    nameOfPaint: string;
    date: string;
    dateInTimestamp: Timestamp
    userName: string;
    urlOfPaint: string
  }
