import { BasicUser } from './user'
import fb from '../firebase'

export enum OrderStatus {
  ARCHIVED = "ARCHIVED",
  CLAIMED = "CLAIMED",
  COMPLETE = "COMPLETE",
  PENDING = "PENDING",
}

export enum OrderType {
  MINERALS = "MINERALS",
  ORE = "ORE",
  PLANETARY = "PLANETARY",
  SHIP = "SHIP",
  STRUCTURE = "STRUCTURE",
}

interface OrderItem {
  name: string,
  value: number
}

export interface Order {
  amountIsk: number,
  archivedBy?: BasicUser
  claimedBy?: BasicUser,
  createdAt: fb.firestore.Timestamp | fb.firestore.FieldValue,
  createdBy: BasicUser,
  discord: {
    channelId: string,
    threadId: string,
  },
  id?: string,
  guildId: string,
  purchasing: OrderItem[],
  selling: OrderItem[],
  ship?: any,
  status: OrderStatus,
  type: OrderType,
  updatedAt: fb.firestore.Timestamp | fb.firestore.FieldValue,
}
