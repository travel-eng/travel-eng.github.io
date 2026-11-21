// 호주(시드니) 여행 이야기. 하루 1화.
// lines: who = "npc"(상대) | "me"(나) | "nar"(해설)
// me 줄: en = 정답, ko = 하고 싶은 말, wrong = 틀린 보기 2개
// words: 이 화의 핵심 단어 (en, ko). key: 미션에서 문장 만들기로 나오는 문장
window.STORY = {
  city: "시드니",
  country: "호주",
  flag: "🇦🇺",
  episodes: [
    {
      title: "인천공항 체크인", icon: "✈️",
      intro: "드디어 출발하는 날! 캐리어를 끌고 인천공항에 도착했어요. 시드니행 비행기를 타려면 먼저 항공사 카운터에서 체크인을 해야 해요. 직원이 웃으며 나를 불러요.",
      lines: [
        { who: "npc", name: "직원", en: "Good morning! Where are you flying today?", ko: "안녕하세요! 오늘 어디로 가세요?" },
        { who: "me", en: "I'm flying to Sydney.", ko: "시드니로 가요.", wrong: ["I'm from Sydney.", "I like Sydney."] },
        { who: "npc", name: "직원", en: "May I see your passport, please?", ko: "여권 좀 보여 주시겠어요?" },
        { who: "me", en: "Here is my passport.", ko: "여기 제 여권이요.", wrong: ["Where is my passport?", "I lost my passport."] },
        { who: "npc", name: "직원", en: "Would you like a window seat or an aisle seat?", ko: "창가 자리와 통로 자리 중 어디로 드릴까요?" },
        { who: "me", en: "Window seat, please.", ko: "창가 자리로 주세요.", wrong: ["Check, please.", "Menu, please."] },
        { who: "npc", name: "직원", en: "Here is your boarding pass. Have a nice flight!", ko: "탑승권 여기 있어요. 즐거운 비행 되세요!" }
      ],
      words: [["passport", "여권"], ["seat", "좌석"], ["window", "창문, 창가"], ["boarding pass", "탑승권"], ["flight", "비행기 편"]],
      key: "I'm flying to Sydney.",
      teaser: "비행기에 올라 창가 자리에 앉았어요. 그런데 옆자리 사람이 내 가방에 달린 키링을 보더니 갑자기 말을 거는데..."
    },
    {
      title: "비행기 안에서", icon: "🛫",
      intro: "옆자리에 앉은 사람은 금발의 여행자예요. 내 가방의 캥거루 키링을 가리키며 환하게 웃어요.",
      lines: [
        { who: "npc", name: "Emma", en: "Hi! I like your keyring. Are you going to Sydney too?", ko: "안녕하세요! 키링 예쁘네요. 시드니 가세요?" },
        { who: "me", en: "Yes, it's my first time.", ko: "네, 처음 가 봐요.", wrong: ["No, thank you.", "Yes, it's my seat."] },
        { who: "npc", name: "Emma", en: "Oh, lovely! I'm Emma. I live in Sydney.", ko: "와, 좋네요! 저는 엠마예요. 시드니에 살아요." },
        { who: "me", en: "Nice to meet you, Emma.", ko: "만나서 반가워요, 엠마.", wrong: ["See you later, Emma.", "Excuse me, Emma."] },
        { who: "npc", name: "승무원", en: "Would you like chicken or beef?", ko: "치킨과 소고기 중 뭘로 드릴까요?" },
        { who: "me", en: "Chicken, please.", ko: "치킨으로 주세요.", wrong: ["Chicken is here.", "I am chicken."] },
        { who: "npc", name: "Emma", en: "If you need any help in Sydney, just call me!", ko: "시드니에서 도움 필요하면 언제든 전화해요!" }
      ],
      words: [["first time", "처음"], ["live", "살다"], ["meet", "만나다"], ["chicken", "닭고기"], ["beef", "소고기"]],
      key: "Nice to meet you, Emma.",
      teaser: "엠마가 전화번호를 적어 줬어요. 10시간 뒤, 드디어 시드니 도착! 그런데 입국 심사대 앞에 '음식 신고'라는 큰 표지판이 보여요. 가방에 김이 있는데..."
    },
    {
      title: "시드니 도착, 입국 심사", icon: "🛂",
      intro: "호주는 음식, 식물, 동물을 들여오는 것에 아주 엄격해요. 신고하지 않으면 벌금을 낼 수도 있어요. 심사관 앞에 섰어요.",
      lines: [
        { who: "npc", name: "심사관", en: "What's the purpose of your visit?", ko: "방문 목적이 뭐예요?" },
        { who: "me", en: "I'm here for sightseeing.", ko: "관광하러 왔어요.", wrong: ["I'm here for dinner.", "I'm here at the gate."] },
        { who: "npc", name: "심사관", en: "How long will you stay?", ko: "얼마나 머물 건가요?" },
        { who: "me", en: "I will stay for ten days.", ko: "10일 동안 머물 거예요.", wrong: ["I will stay at ten.", "I am ten days."] },
        { who: "npc", name: "심사관", en: "Do you have any food to declare?", ko: "신고할 음식이 있나요?" },
        { who: "me", en: "Yes, I have some dried seaweed.", ko: "네, 마른 김이 좀 있어요.", wrong: ["No, I'm not hungry.", "Yes, I have a seat."] },
        { who: "npc", name: "심사관", en: "Thanks for declaring. That's fine. Welcome to Australia!", ko: "신고해 줘서 고마워요. 괜찮아요. 호주에 온 걸 환영해요!" }
      ],
      words: [["purpose", "목적"], ["visit", "방문"], ["declare", "신고하다"], ["food", "음식"], ["welcome", "환영하다"]],
      key: "Do you have any food to declare?",
      teaser: "무사히 통과! 이제 시내로 가야 하는데, 공항 기차역 개찰구에 '카드를 대세요'라고만 써 있어요. 표는 어디서 사지?"
    },
    {
      title: "공항에서 시내로", icon: "🚆",
      intro: "시드니 기차는 표 대신 교통카드나 신용카드를 개찰구에 대고 타요(tap on). 내릴 때도 꼭 다시 대야 해요(tap off). 역무원에게 물어봐요.",
      lines: [
        { who: "me", en: "Excuse me, how do I get to the city?", ko: "실례합니다, 시내에 어떻게 가요?", wrong: ["Excuse me, where is the city?", "Excuse me, I am the city."] },
        { who: "npc", name: "역무원", en: "Take this train to Central Station.", ko: "이 기차를 타고 센트럴 역까지 가세요." },
        { who: "me", en: "Can I use my credit card?", ko: "신용카드 써도 되나요?", wrong: ["Can I eat my credit card?", "Can I see your card?"] },
        { who: "npc", name: "역무원", en: "Yes, just tap on here and tap off when you get off.", ko: "네, 여기 카드를 대고, 내릴 때 다시 대세요." },
        { who: "me", en: "Thank you. Which platform is it?", ko: "고마워요. 몇 번 승강장이에요?", wrong: ["Thank you. Which hotel is it?", "Thank you. What time is it?"] },
        { who: "npc", name: "역무원", en: "Platform one. No worries!", ko: "1번 승강장이요. 천만에요!" }
      ],
      words: [["train", "기차"], ["platform", "승강장"], ["tap", "가볍게 대다"], ["credit card", "신용카드"], ["no worries", "괜찮아요, 천만에요 (호주식)"]],
      key: "Which platform is it?",
      teaser: "센트럴 역에서 내려 호텔에 도착했어요. 그런데 프런트 직원이 컴퓨터를 보며 고개를 갸웃해요. '손님 예약이... 안 보이는데요?'"
    },
    {
      title: "호텔 체크인", icon: "🏨",
      intro: "예약이 안 보인다니! 당황하지 말고 예약 확인 메일을 보여 주기로 해요.",
      lines: [
        { who: "me", en: "Hi, I have a reservation.", ko: "안녕하세요, 예약했어요.", wrong: ["Hi, I have a question.", "Hi, I have a room."] },
        { who: "npc", name: "직원", en: "Sorry, I can't find your name.", ko: "죄송해요, 성함을 못 찾겠어요." },
        { who: "me", en: "Here is my confirmation email.", ko: "여기 예약 확인 메일이에요.", wrong: ["Here is my phone number.", "Here is my breakfast."] },
        { who: "npc", name: "직원", en: "Ah, I see. It was under a different spelling. Sorry about that!", ko: "아, 그렇군요. 이름 철자가 달랐네요. 죄송해요!" },
        { who: "me", en: "No worries. Is breakfast included?", ko: "괜찮아요. 조식 포함인가요?", wrong: ["No worries. Is the bus included?", "No worries. Where is breakfast?"] },
        { who: "npc", name: "직원", en: "Yes, from seven to ten. Here is your key. Room 512.", ko: "네, 7시부터 10시까지예요. 열쇠 여기 있어요. 512호예요." }
      ],
      words: [["confirmation", "확인"], ["email", "이메일"], ["name", "이름"], ["included", "포함된"], ["key", "열쇠"]],
      key: "Here is my confirmation email.",
      teaser: "방에 짐을 풀자 엠마에게서 문자가 왔어요. '내일 아침에 커피 한잔해요! 호주 커피는 세계 최고예요.' 그런데 메뉴판에 아메리카노가 없다는데..."
    },
    {
      title: "카페에서 커피 주문", icon: "☕",
      intro: "호주 사람들은 커피를 정말 사랑해요. 대표 메뉴는 flat white(플랫 화이트, 우유가 들어간 진한 커피)예요. 아메리카노 대신 long black을 시켜요.",
      lines: [
        { who: "npc", name: "Emma", en: "Good morning! Have you tried a flat white?", ko: "좋은 아침! 플랫 화이트 마셔 봤어요?" },
        { who: "me", en: "No, I haven't. What is it?", ko: "아니요, 안 마셔 봤어요. 그게 뭐예요?", wrong: ["No, I'm not hungry.", "Yes, it's my bag."] },
        { who: "npc", name: "Emma", en: "It's coffee with steamed milk. You'll love it!", ko: "데운 우유를 넣은 커피예요. 분명 좋아할 거예요!" },
        { who: "npc", name: "점원", en: "Hi there, what can I get for you?", ko: "안녕하세요, 뭐 드릴까요?" },
        { who: "me", en: "Can I have a flat white, please?", ko: "플랫 화이트 하나 주세요.", wrong: ["Can I have a flat tire, please?", "Can I have a white table, please?"] },
        { who: "npc", name: "점원", en: "Sure. Is it for here or to go?", ko: "네. 드시고 가세요, 가져가세요?" },
        { who: "me", en: "For here, please.", ko: "먹고 갈게요.", wrong: ["For you, please.", "From here, please."] }
      ],
      words: [["coffee", "커피"], ["milk", "우유"], ["try", "먹어 보다, 해 보다"], ["for here", "매장에서 먹는"], ["to go", "포장(가져가는)"]],
      key: "Can I have a flat white, please?",
      teaser: "커피를 다 마시자 엠마가 말해요. '이제 시드니에서 제일 유명한 곳에 가 볼까요?' 하얀 조개껍데기 같은 건물이 저 멀리 보여요..."
    },
    {
      title: "오페라 하우스", icon: "🎭",
      intro: "시드니 오페라 하우스 앞! 너무 멋져서 사진을 찍고 싶어요. 지나가던 사람에게 사진을 부탁해 봐요.",
      lines: [
        { who: "npc", name: "Emma", en: "Isn't it beautiful?", ko: "정말 아름답지 않아요?" },
        { who: "me", en: "Wow, it's amazing!", ko: "와, 정말 멋져요!", wrong: ["Wow, it's expensive!", "Wow, it's my key!"] },
        { who: "me", en: "Excuse me, could you take a photo of us?", ko: "실례합니다, 저희 사진 좀 찍어 주시겠어요?", wrong: ["Excuse me, could you take my bag?", "Excuse me, could you call the police?"] },
        { who: "npc", name: "관광객", en: "Of course! Say cheese!", ko: "물론이죠! 김치~ (치즈 하세요!)" },
        { who: "me", en: "Thank you so much!", ko: "정말 고마워요!", wrong: ["Sorry, I'm late!", "How much is it?"] },
        { who: "npc", name: "관광객", en: "You're welcome. Enjoy your trip!", ko: "천만에요. 즐거운 여행 하세요!" }
      ],
      words: [["photo", "사진"], ["amazing", "놀라운, 멋진"], ["take", "찍다, 가져가다"], ["of course", "물론이죠"], ["trip", "여행"]],
      key: "Could you take a photo of us?",
      teaser: "엠마가 갑자기 손뼉을 쳐요. '내일은 본다이 비치 가요! 수영복 꼭 챙겨요.' 그런데 나는 수영복이 없는데..."
    },
    {
      title: "본다이 비치", icon: "🏖️",
      intro: "시드니에서 가장 유명한 해변, 본다이 비치! 호주 해변에서는 빨간색과 노란색 깃발 사이에서만 수영해야 안전해요. 구조대(lifeguard)가 지켜 주는 곳이거든요.",
      lines: [
        { who: "me", en: "Where can I buy a swimsuit?", ko: "수영복은 어디서 살 수 있어요?", wrong: ["Where can I eat a swimsuit?", "Where is my swimsuit?"] },
        { who: "npc", name: "Emma", en: "There's a shop next to the cafe.", ko: "카페 옆에 가게가 있어요." },
        { who: "npc", name: "구조대원", en: "Please swim between the flags.", ko: "깃발 사이에서 수영하세요." },
        { who: "me", en: "Is it safe to swim here?", ko: "여기서 수영해도 안전해요?", wrong: ["Is it far to swim here?", "Is it cheap to swim here?"] },
        { who: "npc", name: "구조대원", en: "Yes, between the red and yellow flags.", ko: "네, 빨간색과 노란색 깃발 사이는요." },
        { who: "me", en: "Do you have any sunscreen?", ko: "선크림 있어요?", wrong: ["Do you have any sunshine?", "Do you have any sandwich?"] },
        { who: "npc", name: "Emma", en: "Here you go. The sun is really strong in Australia!", ko: "여기요. 호주는 햇볕이 정말 강해요!" }
      ],
      words: [["beach", "해변"], ["swim", "수영하다"], ["safe", "안전한"], ["sunscreen", "선크림"], ["flag", "깃발"]],
      key: "Is it safe to swim here?",
      teaser: "신나게 놀고 혼자 버스를 탔어요. 창밖을 보다 깜빡 잠이 들었는데... 눈을 떠 보니 처음 보는 동네예요! 휴대폰 배터리도 2%..."
    },
    {
      title: "길을 잃다!", icon: "🧭",
      intro: "모르는 동네에 혼자예요. 침착하게! 가까운 가게에 들어가 도움을 청해 봐요.",
      lines: [
        { who: "me", en: "Excuse me, I'm lost. Can you help me?", ko: "실례합니다, 길을 잃었어요. 도와주시겠어요?", wrong: ["Excuse me, I'm late. Can you sing?", "Excuse me, I'm full. Can you eat?"] },
        { who: "npc", name: "가게 주인", en: "Sure, mate. Where do you want to go?", ko: "물론이죠, 친구. 어디로 가고 싶어요?" },
        { who: "me", en: "I want to go to Central Station.", ko: "센트럴 역에 가고 싶어요.", wrong: ["I want to eat Central Station.", "I want to buy Central Station."] },
        { who: "npc", name: "가게 주인", en: "Take the bus from the stop across the street.", ko: "길 건너 정류장에서 버스를 타세요." },
        { who: "me", en: "Could I charge my phone here?", ko: "여기서 휴대폰 충전해도 될까요?", wrong: ["Could I change my phone here?", "Could I call my phone here?"] },
        { who: "npc", name: "가게 주인", en: "No worries. The charger is over there.", ko: "그럼요. 충전기는 저기 있어요." }
      ],
      words: [["lost", "길 잃은"], ["across", "건너편에"], ["charge", "충전하다"], ["mate", "친구 (호주식)"], ["want", "원하다"]],
      key: "I want to go to Central Station.",
      teaser: "휴대폰이 켜지자 엠마의 메시지가 와 있어요. '어디예요?! 내일이 마지막 날이죠? 꼭 보여 주고 싶은 곳이 있어요.'"
    },
    {
      title: "마켓에서 작별", icon: "🛍️",
      intro: "마지막 날, 엠마와 함께 주말 마켓에 왔어요. 가족에게 줄 선물을 사고, 엠마에게 고맙다는 인사도 해야 해요.",
      lines: [
        { who: "me", en: "How much is this koala?", ko: "이 코알라 인형 얼마예요?", wrong: ["How old is this koala?", "Where is this koala?"] },
        { who: "npc", name: "상인", en: "It's twenty dollars.", ko: "20달러예요." },
        { who: "me", en: "Can I get a discount for two?", ko: "두 개 사면 할인돼요?", wrong: ["Can I get a dinner for two?", "Can I get a table for two?"] },
        { who: "npc", name: "상인", en: "Okay, thirty-five dollars for two.", ko: "좋아요, 두 개에 35달러요." },
        { who: "npc", name: "Emma", en: "I'm going to miss you!", ko: "보고 싶을 거예요!" },
        { who: "me", en: "Thank you for everything, Emma.", ko: "모든 것에 고마워요, 엠마.", wrong: ["Thank you for the menu, Emma.", "Sorry for the bus, Emma."] },
        { who: "npc", name: "Emma", en: "Come back soon, okay? Keep in touch!", ko: "꼭 다시 와요, 알았죠? 계속 연락해요!" }
      ],
      words: [["dollar", "달러"], ["discount", "할인"], ["miss", "그리워하다"], ["everything", "모든 것"], ["keep in touch", "연락하고 지내다"]],
      key: "Thank you for everything.",
      teaser: "공항으로 가는 기차 안, 여권을 펼쳐 보니 시드니 도장이 반짝여요. 다음 여행은 어디로 갈까요?"
    }
  ]
};

// 이야기 단어를 단어장(WORDS)에 연결. 없는 단어는 뒤에 추가하고, 예문은 이야기 속 문장에서 가져옴.
(function () {
  var W = window.WORDS;
  window.STORY.episodes.forEach(function (ep, n) {
    ep.wordIdx = ep.words.map(function (pair) {
      var en = pair[0];
      for (var i = 0; i < W.length; i++) if (W[i].en.toLowerCase() === en.toLowerCase()) return i;
      var lines = ep.lines.filter(function (l) { return l.en.toLowerCase().indexOf(en.toLowerCase()) >= 0; });
      var ex = lines[0] || { en: ep.key, ko: "" };
      W.push({ en: en, ko: pair[1], ex: ex.en, exko: ex.ko, story: n });
      return W.length - 1;
    });
  });
})();
