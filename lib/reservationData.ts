export interface Reservation {
  id: string;
  memberId: string;
  memberName: string;
  email: string;
  ticketType: string;
  reservationTime: string;
  status: string;
  paymentAmount: number;
  paymentMethod: string;
  transactionId: string;
  purchaseDate: string;
  quantity: number;
  additionalInfo: string;
}

export const reservations: Reservation[] = [
  {
    id: "RES-001",
    memberId: "M001",
    memberName: "임형근",
    email: "lhg010115@gmail.com",
    ticketType: "종합이용권 1Day",
    reservationTime: "2025-06-01 10:00",
    status: "Confirmed",
    paymentAmount: 59000,
    paymentMethod: "신용카드",
    transactionId: "TXN-10001",
    purchaseDate: "2024-06-25",
    quantity: 2,
    additionalInfo: "생일 기념 방문",
  },
  {
    id: "RES-002",
    memberId: "M002",
    memberName: "김철수",
    email: "kim@example.com",
    ticketType: "After4",
    reservationTime: "2025-05-15 16:30",
    status: "Completed",
    paymentAmount: 39000,
    paymentMethod: "카카오페이",
    transactionId: "TXN-10002",
    purchaseDate: "2024-06-26",
    quantity: 1,
    additionalInfo: "",
  },
  {
    id: "RES-003",
    memberId: "M003",
    memberName: "이영희",
    email: "lee@example.com",
    ticketType: "파크이용권 1Day",
    reservationTime: "2024-07-03 09:30",
    status: "Cancelled",
    paymentAmount: 69000,
    paymentMethod: "계좌이체",
    transactionId: "TXN-10003",
    purchaseDate: "2025-05-27",
    quantity: 3,
    additionalInfo: "",
  },
];