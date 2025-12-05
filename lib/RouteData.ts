export interface Route {
    id: number
    start_poi: string
    end_poi: string
    svg_path_url: string
  }
  
  export const routeData: Route[] = [
    {
      id: 1,
      start_poi: "아틀란티스",
      end_poi: "자이로드롭",
      svg_path_url: "/uploads/routes/atlantis-to-gyrodrop.svg",
    },
    {
      id: 2,
      start_poi: "후렌치 레볼루션",
      end_poi: "번지드롭",
      svg_path_url: "/uploads/routes/french-to-bungee.svg",
    },
    {
      id: 3,
      start_poi: "롯데리아",
      end_poi: "화장실 A동",
      svg_path_url: "/uploads/routes/lotteria-to-restroom-a.svg",
    },
    {
      id: 4,
      start_poi: "안내소",
      end_poi: "스카이웨이",
      svg_path_url: "/uploads/routes/info-to-skyway.svg",
    },
    {
      id: 5,
      start_poi: "자이로스핀",
      end_poi: "스위트랜드",
      svg_path_url: "/uploads/routes/gyrospin-to-sweetland.svg",
    },
  ]
  