// 듣고 대답하기: 장면별 짧은 대화
// q = 상대가 하는 말(영어), qko = 뜻, hint = 대답 요령(한국어), ans = 모범 대답들(첫 번째를 들려줌)
// keys = 대답에 들어 있으면 통과로 보는 말 묶음. 묶음마다 하나 이상 있어야 함.
//   "#num" = 숫자(5, five 등), "#any" = 무엇이든 대답하면 통과
window.DIALOGS = [
  { id: "imm", icon: "🛂", scene: "공항", title: "입국 심사", who: "심사관", turns: [
    { q: "May I see your passport, please?", qko: "여권 보여 주시겠어요?", hint: "여권을 건네며 '여기 있어요'라고 해요.", ans: ["Here is my passport.", "Here you are.", "Sure, here it is."], keys: [["here", "sure", "yes", "okay", "ok"]] },
    { q: "What's the purpose of your visit?", qko: "방문 목적이 뭐예요?", hint: "관광이면 sightseeing, 휴가면 vacation.", ans: ["I'm here for sightseeing.", "Sightseeing.", "For vacation."], keys: [["sightseeing", "vacation", "holiday", "travel", "traveling", "tour", "tourism", "trip", "business", "visit"]] },
    { q: "How long will you stay?", qko: "얼마나 머무를 거예요?", hint: "기간을 말해요. for + 숫자 + days.", ans: ["I will stay for five days.", "Five days.", "For one week."], keys: [["#num", "week", "weeks", "month"]] },
    { q: "Where are you staying?", qko: "어디에 묵어요?", hint: "숙소를 말해요. I'm staying at a hotel.", ans: ["I'm staying at a hotel downtown.", "At a hotel.", "At my friend's house."], keys: [["hotel", "hostel", "friend", "friend's", "airbnb", "house", "apartment", "resort", "inn", "motel"]] },
    { q: "Do you have anything to declare?", qko: "신고할 물건 있어요?", hint: "없으면 '아니요, 없어요'.", ans: ["No, I don't.", "Nothing to declare.", "No."], keys: [["no", "nothing", "yes"]] }
  ]},
  { id: "hotel", icon: "🏨", scene: "호텔", title: "체크인", who: "직원", turns: [
    { q: "Hello! How can I help you?", qko: "안녕하세요! 무엇을 도와드릴까요?", hint: "체크인하고 싶다고 해요.", ans: ["I'd like to check in, please.", "Check in, please.", "I have a reservation."], keys: [["check", "reservation", "booking", "booked", "checking"]] },
    { q: "May I have your name, please?", qko: "성함이 어떻게 되세요?", hint: "My name is + 이름. 예약 이름이면 It's under + 이름.", ans: ["My name is Kim.", "It's under Kim."], keys: [["#any"]] },
    { q: "How many nights will you stay?", qko: "몇 박 하실 거예요?", hint: "숫자 + nights.", ans: ["Three nights.", "For three nights."], keys: [["#num"]] },
    { q: "Here is your key. Your room is on the fifth floor.", qko: "열쇠 여기 있어요. 방은 5층이에요.", hint: "고맙다고 하고, 궁금한 걸 물어봐도 돼요.", ans: ["Thank you. What time is breakfast?", "Thank you."], keys: [["thank", "thanks", "breakfast", "what", "great"]] },
    { q: "Breakfast is from seven to ten. Anything else?", qko: "아침은 7시부터 10시까지예요. 더 필요한 건요?", hint: "와이파이 비밀번호를 묻거나, 없으면 '괜찮아요'.", ans: ["What's the Wi-Fi password?", "No, that's all. Thank you."], keys: [["wi-fi", "wifi", "password", "no", "that's all", "thank", "thanks"]] }
  ]},
  { id: "rest", icon: "🍽️", scene: "식당", title: "주문하기", who: "직원", turns: [
    { q: "Hi! How many people?", qko: "안녕하세요! 몇 분이세요?", hint: "인원수를 말해요. Table for two, please.", ans: ["Table for two, please.", "Two, please.", "Just one."], keys: [["#num", "just me", "alone"]] },
    { q: "Are you ready to order?", qko: "주문하시겠어요?", hint: "메뉴를 가리키며 I'll have this one. 아직이면 Not yet.", ans: ["I'll have this one.", "Yes, I'll have the pasta.", "Not yet, please."], keys: [["have", "like", "this", "yes", "not yet", "minute", "want", "get"]] },
    { q: "Would you like something to drink?", qko: "마실 것 드릴까요?", hint: "마실 것 + please. 필요 없으면 No, thank you.", ans: ["Water, please.", "A coke, please.", "No, thank you."], keys: [["water", "coke", "cola", "beer", "juice", "coffee", "tea", "wine", "soda", "lemonade", "no"]] },
    { q: "How was everything?", qko: "음식은 어떠셨어요?", hint: "맛있었다고 해요. It was great!", ans: ["It was great, thank you.", "Delicious!", "Very good."], keys: [["great", "good", "delicious", "nice", "amazing", "perfect", "fine", "excellent", "yummy", "tasty"]] },
    { q: "Would you like anything else?", qko: "더 필요한 거 있으세요?", hint: "계산서를 달라고 해요.", ans: ["Just the check, please.", "Check, please.", "No, thank you."], keys: [["check", "bill", "no", "that's all"]] }
  ]},
  { id: "cafe", icon: "☕", scene: "카페", title: "커피 주문", who: "바리스타", turns: [
    { q: "Hi there, what can I get for you?", qko: "안녕하세요, 뭐 드릴까요?", hint: "Can I have + 메뉴, please?", ans: ["Can I have a flat white, please?", "One latte, please."], keys: [["coffee", "latte", "flat white", "americano", "cappuccino", "espresso", "tea", "mocha", "have", "get", "like"]] },
    { q: "What size would you like?", qko: "어떤 크기로 드릴까요?", hint: "small / regular / large 중에서.", ans: ["Small, please.", "Regular, please.", "Large, please."], keys: [["small", "regular", "medium", "large", "big", "tall"]] },
    { q: "Is it for here or to go?", qko: "드시고 가세요, 가져가세요?", hint: "여기서 마시면 For here, 가져가면 To go.", ans: ["For here, please.", "To go, please."], keys: [["here", "go", "takeaway", "take away"]] },
    { q: "That's five fifty. How would you like to pay?", qko: "5달러 50센트예요. 어떻게 계산하시겠어요?", hint: "카드면 By card, 현금이면 In cash.", ans: ["By card, please.", "Can I pay by card?", "In cash."], keys: [["card", "cash"]] }
  ]},
  { id: "shop", icon: "🛍️", scene: "가게", title: "옷 사기", who: "점원", turns: [
    { q: "Hi! Can I help you find anything?", qko: "안녕하세요! 찾으시는 거 있으세요?", hint: "그냥 구경 중이면 Just looking, thanks.", ans: ["Just looking, thanks.", "Do you have this in black?"], keys: [["looking", "have", "yes", "no", "thanks", "thank", "looking for"]] },
    { q: "Would you like to try it on?", qko: "입어 보시겠어요?", hint: "네 + 탈의실이 어디냐고 물어봐요.", ans: ["Yes, please. Where is the fitting room?", "Yes, please."], keys: [["yes", "sure", "try", "fitting", "okay", "ok", "no"]] },
    { q: "How does it fit?", qko: "잘 맞으세요?", hint: "크면 It's too big. 딱 맞으면 It fits well.", ans: ["It's too big. Do you have a smaller size?", "It fits well."], keys: [["big", "small", "tight", "loose", "fits", "fit", "good", "perfect", "size", "great", "long", "short"]] },
    { q: "That's thirty dollars.", qko: "30달러예요.", hint: "카드로 내도 되는지 물어봐요.", ans: ["Can I pay by card?", "Here you go."], keys: [["card", "cash", "here", "okay", "ok"]] }
  ]},
  { id: "way", icon: "🗺️", scene: "길 찾기", title: "길 묻기", who: "지나가는 사람", turns: [
    { q: "You look lost. Can I help you?", qko: "길을 잃으신 것 같네요. 도와드릴까요?", hint: "네 + 가고 싶은 곳을 물어봐요. Where is ~?", ans: ["Yes, please. Where is the train station?", "How do I get to Central Station?"], keys: [["where", "how", "get", "station", "yes", "looking"]] },
    { q: "Go straight and turn left at the corner.", qko: "쭉 가다가 모퉁이에서 왼쪽으로 도세요.", hint: "멀어요? 하고 묻거나(Is it far?), 고맙다고 해요.", ans: ["Is it far from here?", "Thank you so much."], keys: [["far", "thank", "thanks", "straight", "left", "again", "minutes", "walk"]] },
    { q: "It's about ten minutes on foot.", qko: "걸어서 10분쯤이에요.", hint: "고맙다고 해요.", ans: ["Thank you so much!", "Great, thanks!"], keys: [["thank", "thanks", "great", "okay", "ok"]] }
  ]},
  { id: "taxi", icon: "🚕", scene: "교통", title: "택시 타기", who: "기사님", turns: [
    { q: "Where to?", qko: "어디로 가세요?", hint: "To + 목적지, please. 주소를 보여 주면 To this address, please.", ans: ["To this address, please.", "To the airport, please."], keys: [["to", "airport", "hotel", "address", "station", "downtown"]] },
    { q: "Are you in a hurry?", qko: "급하세요?", hint: "네/아니요로 대답해요.", ans: ["Yes, my flight is at six.", "No, I'm not."], keys: [["yes", "no", "flight", "hurry", "not", "little"]] },
    { q: "Here we are. That's twenty-five dollars.", qko: "다 왔어요. 25달러예요.", hint: "카드로 내도 되는지 묻거나, 돈을 주며 Here you go.", ans: ["Can I pay by card?", "Here you go. Keep the change."], keys: [["card", "cash", "here", "keep", "change", "thank", "thanks"]] }
  ]}
];
