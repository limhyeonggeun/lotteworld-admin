export const orders = [
    {
      id: "ORD-2024-0001",
      customer: {
        name: "김철수",
        id: "M001",
      },
      items: [
        { name: "떡볶이", quantity: 1, price: 5000, options: "매운맛" },
        { name: "튀김세트", quantity: 1, price: 4000 },
      ],
      orderTime: "2024-06-01 12:30",
      pickupTime: "2024-06-01 12:45",
      status: "pickedUp",
      payment: {
        amount: 9000,
        method: "kakaoPay",
        time: "2024-06-01 12:30",
        cardInfo: null,
        approvalNumber: null,
      },
      note: "소스 많이 주세요",
      statusHistory: [
        { status: "created", time: "2024-06-01 12:30", by: "시스템" },
        { status: "preparing", time: "2024-06-01 12:32", by: "김요리사" },
        { status: "ready", time: "2024-06-01 12:40", by: "김요리사" },
        { status: "pickedUp", time: "2024-06-01 12:45", by: "이매니저" },
      ],
    },
    {
      id: "ORD-2024-0002",
      customer: {
        name: "이영희",
        id: "M002",
      },
      items: [
        { name: "핫도그", quantity: 2, price: 3500 },
        { name: "아메리카노", quantity: 1, price: 3000 },
      ],
      orderTime: "2024-06-01 13:15",
      pickupTime: null,
      status: "ready",
      payment: {
        amount: 10000,
        method: "creditCard",
        time: "2024-06-01 13:15",
        cardInfo: "신한카드 (1234)",
        approvalNumber: "123456789",
      },
      note: null,
      statusHistory: [
        { status: "created", time: "2024-06-01 13:15", by: "시스템" },
        { status: "preparing", time: "2024-06-01 13:17", by: "김요리사" },
        { status: "ready", time: "2024-06-01 13:25", by: "김요리사" },
      ],
    },
    {
      id: "ORD-2024-0003",
      customer: {
        name: "박민수",
        id: "M003",
      },
      items: [
        { name: "치즈 핫도그", quantity: 1, price: 4000 },
        { name: "콜라", quantity: 1, price: 2000 },
      ],
      orderTime: "2024-06-01 14:00",
      pickupTime: null,
      status: "cancelled",
      payment: {
        amount: 6000,
        method: "kakaoPay",
        time: "2024-06-01 14:00",
        cardInfo: null,
        approvalNumber: null,
      },
      refund: {
        time: "2024-06-01 14:10",
        amount: 6000,
        reason: "고객 요청으로 인한 취소",
      },
      note: null,
      statusHistory: [
        { status: "created", time: "2024-06-01 14:00", by: "시스템" },
        { status: "preparing", time: "2024-06-01 14:02", by: "김요리사" },
        { status: "cancelled", time: "2024-06-01 14:10", by: "이매니저", note: "고객 요청으로 인한 취소" },
      ],
    },
    {
      id: "ORD-2024-0004",
      customer: {
        name: "정수진",
        id: "M004",
      },
      items: [
        { name: "치킨", quantity: 1, price: 15000, options: "양념" },
        { name: "감자튀김", quantity: 1, price: 5000 },
        { name: "콜라", quantity: 2, price: 2000 },
      ],
      orderTime: "2024-06-01 15:30",
      pickupTime: null,
      status: "preparing",
      payment: {
        amount: 24000,
        method: "creditCard",
        time: "2024-06-01 15:30",
        cardInfo: "국민카드 (5678)",
        approvalNumber: "987654321",
      },
      note: "치킨 조각 크게 잘라주세요",
      statusHistory: [
        { status: "created", time: "2024-06-01 15:30", by: "시스템" },
        { status: "preparing", time: "2024-06-01 15:32", by: "김요리사" },
      ],
    },
    {
      id: "ORD-2024-0005",
      customer: {
        name: "최동현",
        id: "M005",
      },
      items: [
        { name: "떡볶이", quantity: 1, price: 5000, options: "덜 매운맛" },
        { name: "순대", quantity: 1, price: 4000 },
        { name: "어묵", quantity: 2, price: 1000 },
      ],
      orderTime: "2024-06-01 16:45",
      pickupTime: null,
      status: "preparing",
      payment: {
        amount: 11000,
        method: "cash",
        time: "2024-06-01 16:45",
        cardInfo: null,
        approvalNumber: null,
      },
      note: null,
      statusHistory: [
        { status: "created", time: "2024-06-01 16:45", by: "시스템" },
        { status: "preparing", time: "2024-06-01 16:47", by: "김요리사" },
      ],
    },
  ]
  