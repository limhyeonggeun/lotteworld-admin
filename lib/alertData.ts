export interface Alert {
    id: string
    title: string
    content: string
    type: "food" | "weather" | "attraction" | "system"
    recipient: "all_users" | "vip_users" | "new_users" | "specific"
    recipientCount?: number
    deliveryMethod: "push" | "sms" | "email" | "in_app"
    deliveryTime: string
    status: "scheduled" | "sent" | "failed" | "cancelled"
    priority: "low" | "medium" | "high"
    createdAt: string
    imageUrl?: string
    actionUrl?: string
    tags?: string[]
    errorMessage?: string
    deliveryStats?: {
      delivered: number
      opened: number
      clicked: number
    }
  }
  
  export const alerts: Alert[] = [
    {
      id: "ALT-2024-0001",
      title: "새로운 메뉴 출시 안내",
      content: "롯데월드에서 새로운 시그니처 메뉴가 출시되었습니다! 지금 바로 확인해보세요.",
      type: "food",
      recipient: "all_users",
      recipientCount: 15420,
      deliveryMethod: "push",
      deliveryTime: "2024-06-02 12:00",
      status: "sent",
      priority: "medium",
      createdAt: "2024-06-01 10:30",
      imageUrl: "/placeholder.svg?height=200&width=400",
      actionUrl: "https://lotteworld.com/food/new-menu",
      tags: ["음식", "신메뉴", "프로모션"],
      deliveryStats: {
        delivered: 15420,
        opened: 8234,
        clicked: 2156,
      },
    },
    {
      id: "ALT-2024-0002",
      title: "⚠️ 긴급: 어트랙션 임시 중단",
      content: "안전점검으로 인해 자이로드롭이 임시 중단됩니다. 이용에 불편을 드려 죄송합니다.",
      type: "attraction",
      recipient: "all_users",
      recipientCount: 15420,
      deliveryMethod: "push",
      deliveryTime: "2024-06-01 14:30",
      status: "sent",
      priority: "high",
      createdAt: "2024-06-01 14:25",
      tags: ["긴급", "어트랙션", "안전점검"],
      deliveryStats: {
        delivered: 15420,
        opened: 12834,
        clicked: 5678,
      },
    },
    {
      id: "ALT-2024-0003",
      title: "VIP 회원 특별 혜택",
      content: "VIP 회원님만을 위한 특별 할인 혜택을 준비했습니다. 놓치지 마세요!",
      type: "system",
      recipient: "vip_users",
      recipientCount: 1250,
      deliveryMethod: "email",
      deliveryTime: "2024-06-03 10:00",
      status: "scheduled",
      priority: "medium",
      createdAt: "2024-06-01 16:45",
      actionUrl: "https://lotteworld.com/vip/benefits",
      tags: ["VIP", "할인", "특별혜택"],
    },
    {
      id: "ALT-2024-0004",
      title: "날씨 알림: 비 예보",
      content: "오늘 오후 3시부터 비가 예상됩니다. 우산을 준비해주세요.",
      type: "weather",
      recipient: "all_users",
      recipientCount: 15420,
      deliveryMethod: "push",
      deliveryTime: "2024-06-01 13:00",
      status: "failed",
      priority: "low",
      createdAt: "2024-06-01 12:45",
      errorMessage: "푸시 서비스 연결 오류로 인한 전송 실패",
      tags: ["날씨", "비", "우산"],
    },
    {
      id: "ALT-2024-0005",
      title: "주문 확인: 치킨버거 세트",
      content: "주문하신 치킨버거 세트가 준비되었습니다. 픽업 장소로 와주세요.",
      type: "food",
      recipient: "specific",
      recipientCount: 1,
      deliveryMethod: "sms",
      deliveryTime: "2024-06-01 12:45",
      status: "sent",
      priority: "high",
      createdAt: "2024-06-01 12:40",
      tags: ["주문완료", "픽업"],
      deliveryStats: {
        delivered: 1,
        opened: 1,
        clicked: 1,
      },
    },
    {
      id: "ALT-2024-0006",
      title: "신규 회원 환영 메시지",
      content: "롯데월드에 오신 것을 환영합니다! 첫 방문 혜택을 확인해보세요.",
      type: "system",
      recipient: "new_users",
      recipientCount: 234,
      deliveryMethod: "in_app",
      deliveryTime: "2024-06-02 09:00",
      status: "scheduled",
      priority: "low",
      createdAt: "2024-06-01 18:20",
      actionUrl: "https://lotteworld.com/welcome",
      tags: ["신규회원", "환영", "혜택"],
    },
    {
      id: "ALT-2024-0007",
      title: "시스템 점검 안내",
      content: "서비스 개선을 위한 시스템 점검이 예정되어 있습니다. 점검 시간: 오늘 밤 12시-2시",
      type: "system",
      recipient: "all_users",
      recipientCount: 15420,
      deliveryMethod: "push",
      deliveryTime: "2024-06-01 20:00",
      status: "sent",
      priority: "medium",
      createdAt: "2024-06-01 15:30",
      tags: ["시스템점검", "서비스개선"],
      deliveryStats: {
        delivered: 15420,
        opened: 9876,
        clicked: 1234,
      },
    },
    {
      id: "ALT-2024-0008",
      title: "🌟 특별 이벤트: 여름 축제",
      content: "여름을 맞아 특별한 축제가 시작됩니다! 다양한 이벤트와 공연을 즐겨보세요.",
      type: "attraction",
      recipient: "all_users",
      recipientCount: 15420,
      deliveryMethod: "push",
      deliveryTime: "2024-06-05 11:00",
      status: "scheduled",
      priority: "high",
      createdAt: "2024-06-01 19:15",
      imageUrl: "/placeholder.svg?height=200&width=400",
      actionUrl: "https://lotteworld.com/events/summer-festival",
      tags: ["이벤트", "축제", "여름", "공연"],
    },
    {
      id: "ALT-2024-0009",
      title: "이용 안내: 주차장 만차 알림",
      content: "현재 롯데월드 주차장이 만차 상태입니다. 인근 대중교통 이용을 권장드립니다.",
      type: "system",
      recipient: "all_users",
      recipientCount: 15420,
      deliveryMethod: "push",
      deliveryTime: "2024-06-04 11:00",
      status: "sent",
      priority: "medium",
      createdAt: "2024-06-04 10:50",
      tags: ["주차", "이용안내", "대중교통"],
      deliveryStats: {
        delivered: 15420,
        opened: 7841,
        clicked: 1023,
      },
    },
    {
      id: "ALT-2024-0010",
      title: "우천 대비 준비 요청",
      content: "곧 비가 시작될 예정입니다. 실내 어트랙션 이용을 추천드립니다.",
      type: "weather",
      recipient: "all_users",
      recipientCount: 15420,
      deliveryMethod: "push",
      deliveryTime: "2024-06-04 15:30",
      status: "scheduled",
      priority: "low",
      createdAt: "2024-06-04 14:45",
      tags: ["날씨", "우천", "안내"],
    },
    {
      id: "ALT-2024-0011",
      title: "푸드코트 혼잡 알림",
      content: "현재 점심시간으로 인해 푸드코트가 매우 혼잡합니다. 여유 있는 시간대 이용을 부탁드립니다.",
      type: "food",
      recipient: "all_users",
      recipientCount: 15420,
      deliveryMethod: "in_app",
      deliveryTime: "2024-06-04 12:20",
      status: "sent",
      priority: "medium",
      createdAt: "2024-06-04 12:15",
      tags: ["음식", "혼잡", "안내"],
      deliveryStats: {
        delivered: 15420,
        opened: 7234,
        clicked: 1923,
      },
    }
  ]
  