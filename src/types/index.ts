import { Timestamp } from 'firebase/firestore'

export interface DataPaint {
  nameOfPaint: string
  date: string
  dateInTimestamp: Timestamp
  userName: string
  urlOfPaint: string
}

export interface StatePaint {
  dataPaints: DataPaint[]
  filterEmail: string
  filterPaint: string
  sorting: string
  page: number
  perPage: number
}

export interface DataUser {
  email: string
  role: string
}

export interface StateUsers {
  dataUsers: DataUser[]
  filterEmailVal: string
  filterRoleVal: string
  page: number
  perPage: number
}

export interface State {
  user: {
    email: string | null
    uid: string
    isSignIn: boolean
    role: string
  }
}

export const arrayStrokeType = ['line', 'rectangle', 'triangle', 'circle', 'ellipse']

export const arrayStateOfFigure = ['stroke', 'fill']
