// 미리 넣어 둔 여행 영어 문장. level: 1 = 2~4단어, 2 = 5~8단어, 3 = 9단어 이상
// 레벨은 앱이 단어 수로 다시 계산하므로 여기 값은 참고용입니다.
window.PRESET_SENTENCES = [
  // 공항 / 비행기
  { cat: "airport", en: "Window seat, please.", ko: "창가 자리로 주세요." },
  { cat: "airport", en: "Aisle seat, please.", ko: "통로 자리로 주세요." },
  { cat: "airport", en: "Where is gate five?", ko: "5번 게이트가 어디예요?" },
  { cat: "airport", en: "I'm here for sightseeing.", ko: "관광하러 왔어요." },
  { cat: "airport", en: "I will stay for five days.", ko: "5일 동안 머물 거예요." },
  { cat: "airport", en: "Where can I pick up my baggage?", ko: "짐은 어디서 찾나요?" },
  { cat: "airport", en: "Can I have some water, please?", ko: "물 좀 주시겠어요?" },
  { cat: "airport", en: "I'm staying at a hotel downtown.", ko: "시내 호텔에 묵어요." },
  { cat: "airport", en: "My bag didn't come out. Where should I report it?", ko: "제 가방이 안 나왔어요. 어디에 신고해야 하나요?" },
  { cat: "airport", en: "How do I get to the city center from here?", ko: "여기서 시내까지 어떻게 가나요?" },

  // 호텔
  { cat: "hotel", en: "Check in, please.", ko: "체크인 할게요." },
  { cat: "hotel", en: "I have a reservation.", ko: "예약했어요." },
  { cat: "hotel", en: "What time is checkout?", ko: "체크아웃은 몇 시예요?" },
  { cat: "hotel", en: "What's the Wi-Fi password?", ko: "와이파이 비밀번호가 뭐예요?" },
  { cat: "hotel", en: "Can I leave my bags here?", ko: "여기에 짐을 맡길 수 있나요?" },
  { cat: "hotel", en: "Is breakfast included?", ko: "조식 포함인가요?" },
  { cat: "hotel", en: "The air conditioner is not working.", ko: "에어컨이 작동하지 않아요." },
  { cat: "hotel", en: "Could I get one more towel, please?", ko: "수건 하나 더 주시겠어요?" },
  { cat: "hotel", en: "Could you call a taxi for me, please?", ko: "택시 좀 불러 주시겠어요?" },
  { cat: "hotel", en: "I locked myself out of my room. Can you help me?", ko: "방 키를 안에 두고 나왔어요. 도와주시겠어요?" },

  // 식당 / 카페
  { cat: "restaurant", en: "Table for two, please.", ko: "두 명 자리 주세요." },
  { cat: "restaurant", en: "Menu, please.", ko: "메뉴판 주세요." },
  { cat: "restaurant", en: "Check, please.", ko: "계산서 주세요." },
  { cat: "restaurant", en: "I'll have this one.", ko: "이걸로 할게요." },
  { cat: "restaurant", en: "What do you recommend?", ko: "추천해 주실 메뉴가 있나요?" },
  { cat: "restaurant", en: "Can I pay by card?", ko: "카드로 계산할 수 있나요?" },
  { cat: "restaurant", en: "One coffee to go, please.", ko: "커피 한 잔 포장해 주세요." },
  { cat: "restaurant", en: "Not too spicy, please.", ko: "너무 맵지 않게 해 주세요." },
  { cat: "restaurant", en: "I'm allergic to peanuts. Does this have any?", ko: "땅콩 알레르기가 있어요. 이거 땅콩 들어갔나요?" },
  { cat: "restaurant", en: "Could we have a little more time to decide?", ko: "고를 시간을 조금 더 주시겠어요?" },

  // 쇼핑
  { cat: "shopping", en: "How much is this?", ko: "이거 얼마예요?" },
  { cat: "shopping", en: "Just looking, thanks.", ko: "그냥 구경하는 거예요, 감사합니다." },
  { cat: "shopping", en: "Can I try this on?", ko: "이거 입어 봐도 되나요?" },
  { cat: "shopping", en: "Do you have a smaller size?", ko: "더 작은 사이즈 있나요?" },
  { cat: "shopping", en: "Do you have this in black?", ko: "이거 검은색 있나요?" },
  { cat: "shopping", en: "Can I get a tax refund?", ko: "세금 환급 받을 수 있나요?" },
  { cat: "shopping", en: "Could you wrap it as a gift, please?", ko: "선물 포장해 주시겠어요?" },
  { cat: "shopping", en: "I'd like to return this. Here is the receipt.", ko: "이거 환불하고 싶어요. 영수증 여기 있어요." },

  // 길 찾기 / 교통
  { cat: "directions", en: "Where is the restroom?", ko: "화장실이 어디예요?" },
  { cat: "directions", en: "Is it far from here?", ko: "여기서 멀어요?" },
  { cat: "directions", en: "Where is the subway station?", ko: "지하철역이 어디예요?" },
  { cat: "directions", en: "To this address, please.", ko: "이 주소로 가 주세요." },
  { cat: "directions", en: "One ticket to the airport, please.", ko: "공항 가는 표 한 장 주세요." },
  { cat: "directions", en: "Does this bus go downtown?", ko: "이 버스 시내 가나요?" },
  { cat: "directions", en: "Could you show me on the map?", ko: "지도에서 보여 주시겠어요?" },
  { cat: "directions", en: "Excuse me, could you tell me how to get to this place?", ko: "실례합니다, 이 장소에 어떻게 가는지 알려 주시겠어요?" },
  { cat: "directions", en: "Could you let me know when we get to my stop?", ko: "제가 내릴 정류장에 도착하면 알려 주시겠어요?" },

  // 응급 / 도움
  { cat: "emergency", en: "Help me, please!", ko: "도와주세요!" },
  { cat: "emergency", en: "Call the police!", ko: "경찰을 불러 주세요!" },
  { cat: "emergency", en: "I need a doctor.", ko: "의사가 필요해요." },
  { cat: "emergency", en: "I lost my passport.", ko: "여권을 잃어버렸어요." },
  { cat: "emergency", en: "My wallet was stolen.", ko: "지갑을 도난당했어요." },
  { cat: "emergency", en: "Where is the nearest pharmacy?", ko: "가장 가까운 약국이 어디예요?" },
  { cat: "emergency", en: "Can you speak more slowly, please?", ko: "좀 더 천천히 말해 주시겠어요?" },
  { cat: "emergency", en: "I don't feel well. I have a headache and a fever.", ko: "몸이 안 좋아요. 머리가 아프고 열이 나요." },
  { cat: "emergency", en: "Could you help me contact the Korean embassy, please?", ko: "한국 대사관에 연락하는 것 좀 도와주시겠어요?" },

  // 기본 인사
  { cat: "basic", en: "Sounds good.", ko: "좋아요." },
  { cat: "basic", en: "Thank you so much.", ko: "정말 감사합니다." },
  { cat: "basic", en: "Excuse me.", ko: "실례합니다." },
  { cat: "basic", en: "Sorry, I don't understand.", ko: "죄송해요, 이해를 못 했어요." },
  { cat: "basic", en: "Could you say that again, please?", ko: "다시 한 번 말씀해 주시겠어요?" },
  { cat: "basic", en: "Can you write it down for me, please?", ko: "그것 좀 적어 주시겠어요?" },
  { cat: "basic", en: "I'm sorry, my English is not very good.", ko: "죄송해요, 제가 영어를 잘 못해요." }
];

window.CATEGORIES = {
  airport: "공항·비행기",
  hotel: "호텔",
  restaurant: "식당·카페",
  shopping: "쇼핑",
  directions: "길 찾기·교통",
  emergency: "응급·도움",
  basic: "기본 표현",
  story: "호주 여행 이야기",
  mine: "내가 추가한 문장"
};
