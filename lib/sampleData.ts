
export type Member = {
  id: string
  name: string
  email: string
  joinDate: string
  status: string
  reservations: number
  orders: number
  lastLogin: string
  grade: string
  isAdmin: boolean
}

export const members: Member[] = [
    {
      id: "M001",
      name: "임형근",
      email: "lhg010115@gmail.com",
      joinDate: "2024-01-15",
      status: "active",
      reservations: 12,
      orders: 8,
      lastLogin: "2024-01-20",
      grade: "VIP",
      isAdmin: false,
    },
    {
      id: "M002",
      name: "이영희",
      email: "lee@example.com",
      joinDate: "2024-02-10",
      status: "active",
      reservations: 5,
      orders: 3,
      lastLogin: "2024-01-19",
      grade: "Normal",
      isAdmin: false,
    },
    {
      id: "M003",
      name: "박민수",
      email: "park@example.com",
      joinDate: "2024-01-05",
      status: "suspended",
      reservations: 20,
      orders: 15,
      lastLogin: "2024-01-18",
      grade: "VIP",
      isAdmin: false,
    },
    {
      id: "M004",
      name: "정수진",
      email: "jung@example.com",
      joinDate: "2023-12-20",
      status: "active",
      reservations: 8,
      orders: 12,
      lastLogin: "2024-01-21",
      grade: "Normal",
      isAdmin: true,
    },
    {
      id: "M005",
      name: "최동현",
      email: "choi@example.com",
      joinDate: "2024-01-08",
      status: "withdrawn",
      reservations: 2,
      orders: 1,
      lastLogin: "2024-01-10",
      grade: "Normal",
      isAdmin: false,
    },
  ];
  
  export const reservations = [
    { id: "R001", attraction: "자이로드롭", date: "2024-01-20", status: "confirmed" },
    { id: "R002", attraction: "아틀란티스", date: "2024-01-18", status: "completed" },
    { id: "R003", attraction: "후룸라이드", date: "2024-01-15", status: "cancelled" },
  ];
  
  export const orders = [
    { id: "O001", item: "치킨버거 세트", quantity: 2, amount: 18000, date: "2024-01-20" },
    { id: "O002", item: "팝콘", quantity: 1, amount: 5000, date: "2024-01-18" },
    { id: "O003", item: "음료수", quantity: 3, amount: 9000, date: "2024-01-15" },
  ];