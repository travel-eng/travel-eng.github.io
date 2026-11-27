// 베트남 하노이 여행 이야기 (시드니 다음 여행). 하루 1화, 시드니 10화 뒤에 이어서 열려요.
// 형식은 story.js와 같아요. 등장인물: 린(Linh) — 하노이에 사는 대학생, 관광 안내 봉사를 해요.
(function () {
  var S = window.STORY;
  var from = S.episodes.length;
  var EPS = [
    {
      title: "노이바이 공항 도착", icon: "🛬",
      intro: "시드니 여행이 끝나고 몇 달 뒤, 이번에는 베트남 하노이에 도착했어요! 공기가 따뜻하고 오토바이 소리가 들려요. 먼저 공항에서 폰에 넣을 유심(SIM) 카드를 사야 해요.",
      lines: [
        { who: "npc", name: "직원", en: "Hello! Do you need a SIM card?", ko: "안녕하세요! 유심 카드 필요하세요?" },
        { who: "me", en: "Yes, I need a SIM card for seven days.", ko: "네, 7일 쓸 유심 카드가 필요해요.", wrong: ["Yes, I need a seat for seven days.", "No, I need a taxi card."] },
        { who: "npc", name: "직원", en: "This one has data and calls. It's two hundred thousand dong.", ko: "이건 데이터랑 통화가 돼요. 20만 동이에요." },
        { who: "me", en: "Can you put it in my phone?", ko: "제 폰에 넣어 주실 수 있어요?", wrong: ["Can you put it in my bag?", "Can you call my phone?"] },
        { who: "npc", name: "직원", en: "Sure. Okay, it's working now.", ko: "그럼요. 자, 이제 돼요." },
        { who: "me", en: "Great, thank you!", ko: "좋아요, 고마워요!", wrong: ["Great, excuse me!", "Sorry, thank you!"] }
      ],
      words: [["SIM card", "유심 카드"], ["data", "데이터"], ["call", "전화하다, 통화"], ["phone", "전화기, 폰"], ["working", "작동하는"]],
      key: "Can you put it in my phone?",
      teaser: "폰이 터지니 마음이 놓여요. 이제 시내로 가야 하는데, 공항 밖에는 '그랩(Grab)'이라는 초록색 글자가 여기저기 보여요..."
    },
    {
      title: "그랩 타고 구시가지로", icon: "🚗",
      intro: "베트남에서는 앱으로 차를 부르는 '그랩'을 많이 써요. 앱으로 차를 불렀더니 기사님이 도착했어요. 목적지는 하노이 구시가지(Old Quarter)의 호텔이에요.",
      lines: [
        { who: "npc", name: "기사님", en: "Hello! Are you going to the Old Quarter?", ko: "안녕하세요! 구시가지 가시죠?" },
        { who: "me", en: "Yes. Can you take me to this hotel?", ko: "네. 이 호텔로 가 주실래요?", wrong: ["Yes. Can you take me a photo?", "No. Can you eat this hotel?"] },
        { who: "npc", name: "기사님", en: "No problem. Please put on your seat belt.", ko: "문제없어요. 안전벨트 매 주세요." },
        { who: "me", en: "How long does it take?", ko: "얼마나 걸려요?", wrong: ["How much does it eat?", "How long is my hair?"] },
        { who: "npc", name: "기사님", en: "About forty minutes. There is a lot of traffic now.", ko: "40분쯤이요. 지금 차가 많이 막혀요." },
        { who: "me", en: "That's okay. I'm not in a hurry.", ko: "괜찮아요. 급하지 않아요.", wrong: ["That's okay. I'm not a hotel.", "That's okay. I'm very hungry."] }
      ],
      words: [["Old Quarter", "구시가지"], ["take", "데려가다, (시간이) 걸리다"], ["seat belt", "안전벨트"], ["traffic", "교통량, 차"], ["hurry", "서두름"]],
      key: "How long does it take?",
      teaser: "창밖으로 오토바이가 물결처럼 지나가요! 드디어 호텔 앞. 그런데 아직 오전이라 체크인 시간이 한참 남았는데..."
    },
    {
      title: "호텔에 짐 맡기기", icon: "🏨",
      intro: "호텔 체크인은 보통 오후 2시예요. 아직 오전 10시인데, 짐을 끌고 돌아다니기는 힘들어요. 프런트 직원에게 물어봐요.",
      lines: [
        { who: "me", en: "Hi, I have a reservation. Can I check in early?", ko: "안녕하세요, 예약했어요. 일찍 체크인할 수 있어요?", wrong: ["Hi, I have a reservation. Can I check out early?", "Hi, I have a fever. Can I check in early?"] },
        { who: "npc", name: "직원", en: "Sorry, your room is not ready yet. Check-in is at two.", ko: "죄송해요, 방이 아직 준비가 안 됐어요. 체크인은 2시예요." },
        { who: "me", en: "Can I leave my bags here?", ko: "짐을 여기 맡겨도 돼요?", wrong: ["Can I eat my bags here?", "Can I buy my bags here?"] },
        { who: "npc", name: "직원", en: "Of course. Here is your ticket for the bags.", ko: "물론이죠. 짐 보관 표 여기 있어요." },
        { who: "me", en: "Thank you. Is there a good restaurant near here?", ko: "고마워요. 이 근처에 맛있는 식당 있어요?", wrong: ["Thank you. Is there a good bag near here?", "Thank you. Is there a doctor in my room?"] },
        { who: "npc", name: "직원", en: "Yes! Try pho at the corner. It's very popular.", ko: "네! 모퉁이에서 쌀국수 드셔 보세요. 아주 인기 있어요." }
      ],
      words: [["ready", "준비된"], ["leave", "두고 가다, 맡기다"], ["ticket", "표"], ["near", "가까이"], ["popular", "인기 있는"]],
      key: "Can I leave my bags here?",
      teaser: "가방이 없으니 몸이 가벼워요! 모퉁이를 돌자 작은 플라스틱 의자에 사람들이 앉아 쌀국수를 먹고 있어요. 맛있는 냄새가..."
    },
    {
      title: "길거리 쌀국수", icon: "🍜",
      intro: "베트남 쌀국수 '퍼(phở)'는 하노이의 대표 아침 음식이에요. 소고기 쌀국수는 phở bò라고 해요. 작은 가게에 앉으니 주인 아주머니가 다가와요.",
      lines: [
        { who: "npc", name: "주인", en: "Hello! Beef or chicken?", ko: "안녕하세요! 소고기, 닭고기?" },
        { who: "me", en: "One beef pho, please.", ko: "소고기 쌀국수 하나 주세요.", wrong: ["One beef phone, please.", "One bus pho, please."] },
        { who: "npc", name: "주인", en: "Do you want it spicy?", ko: "맵게 해 드려요?" },
        { who: "me", en: "Not too spicy, please. And no cilantro.", ko: "너무 맵지 않게요. 그리고 고수는 빼 주세요.", wrong: ["Very spicy, please. And more ice.", "Not too sleepy, please."] },
        { who: "npc", name: "주인", en: "Okay! Here you go. Be careful, it's hot.", ko: "알겠어요! 여기요. 뜨거우니 조심해요." },
        { who: "me", en: "Wow, it's delicious!", ko: "와, 정말 맛있어요!", wrong: ["Wow, it's dangerous!", "Wow, it's Tuesday!"] }
      ],
      words: [["pho", "쌀국수"], ["spicy", "매운"], ["cilantro", "고수 (향채)"], ["careful", "조심하는"], ["delicious", "아주 맛있는"]],
      key: "One beef pho, please.",
      teaser: "배가 든든해졌어요. 이제 환전을 하고 호수 쪽으로 가 보려는데... 길을 건너려니 오토바이가 끝없이 와요! 어떻게 건너죠?"
    },
    {
      title: "환전과 길 건너기", icon: "🛵",
      intro: "베트남 돈은 '동(dong)'이에요. 0이 많아서 처음엔 헷갈려요. 환전소에서 돈을 바꾸고 나오니, 오토바이가 가득한 길이 기다리고 있어요.",
      lines: [
        { who: "me", en: "I'd like to exchange one hundred dollars.", ko: "100달러를 바꾸고 싶어요.", wrong: ["I'd like to eat one hundred dollars.", "I'd like to change my room."] },
        { who: "npc", name: "직원", en: "Sure. Here is your money. Please count it.", ko: "네. 돈 여기 있어요. 세어 보세요." },
        { who: "me", en: "Can I have some small bills?", ko: "작은 돈으로도 좀 주실래요?", wrong: ["Can I have some small bags?", "Can I have some big pills?"] },
        { who: "npc", name: "Linh", en: "Hi! Are you trying to cross the street? I can help you.", ko: "안녕하세요! 길 건너려는 거죠? 도와줄게요." },
        { who: "me", en: "Yes, please. I'm a little scared.", ko: "네, 부탁해요. 조금 무서워요.", wrong: ["Yes, please. I'm a little hungry.", "No, thanks. I'm a motorbike."] },
        { who: "npc", name: "Linh", en: "Walk slowly and don't stop. The motorbikes will go around you.", ko: "천천히 걷고 멈추지 마세요. 오토바이가 피해 갈 거예요." }
      ],
      words: [["exchange", "환전하다, 교환하다"], ["count", "세다"], ["bill", "지폐, 계산서"], ["cross", "건너다"], ["scared", "무서운"]],
      key: "I'd like to exchange one hundred dollars.",
      teaser: "린 덕분에 무사히 건넜어요! 린은 하노이에 사는 대학생인데, 주말마다 여행자를 돕는대요. 같이 호수에 가 보자는데..."
    },
    {
      title: "호안끼엠 호수", icon: "🌳",
      intro: "호안끼엠 호수는 하노이 한가운데에 있는 호수예요. 빨간 다리와 작은 사원이 있어요. 린이 이곳을 소개해 줘요.",
      lines: [
        { who: "npc", name: "Linh", en: "This is Hoan Kiem Lake. Do you see the red bridge?", ko: "여기가 호안끼엠 호수예요. 빨간 다리 보여요?" },
        { who: "me", en: "Yes, it's so beautiful!", ko: "네, 정말 예뻐요!", wrong: ["Yes, it's so expensive!", "No, it's my bridge!"] },
        { who: "npc", name: "Linh", en: "Many people come here to walk in the evening.", ko: "저녁에 많은 사람이 여기 산책하러 와요." },
        { who: "me", en: "Could you take a photo of me?", ko: "제 사진 좀 찍어 줄래요?", wrong: ["Could you take a bus of me?", "Could you eat a photo of me?"] },
        { who: "npc", name: "Linh", en: "Of course! One, two, three... smile!", ko: "물론이죠! 하나, 둘, 셋... 웃어요!" },
        { who: "me", en: "Thank you, Linh. You are so kind.", ko: "고마워요, 린. 정말 친절해요.", wrong: ["Thank you, Linh. You are so late.", "Sorry, Linh. You are a bridge."] }
      ],
      words: [["lake", "호수"], ["bridge", "다리"], ["evening", "저녁"], ["smile", "웃다, 미소"], ["kind", "친절한"]],
      key: "Could you take a photo of me?",
      teaser: "산책을 하다 보니 린이 '하노이에 왔으면 꼭 마셔야 하는 커피'가 있대요. 커피에... 달걀을 넣는다고요?!"
    },
    {
      title: "에그 커피", icon: "☕",
      intro: "에그 커피는 달걀노른자와 설탕을 거품처럼 저어서 커피 위에 올린 하노이 명물이에요. 맛이 꼭 커스터드 크림 같대요. 린과 작은 카페에 들어왔어요.",
      lines: [
        { who: "npc", name: "직원", en: "Hi! What would you like?", ko: "안녕하세요! 뭐 드릴까요?" },
        { who: "me", en: "Two egg coffees, please.", ko: "에그 커피 두 잔 주세요.", wrong: ["Two egg sandwiches, please.", "Two eggs, no coffee."] },
        { who: "npc", name: "직원", en: "Hot or iced?", ko: "따뜻한 거요, 아이스요?" },
        { who: "me", en: "Hot, please.", ko: "따뜻한 걸로 주세요.", wrong: ["Hat, please.", "Hurry, please."] },
        { who: "npc", name: "Linh", en: "Try it! It tastes like cake.", ko: "마셔 봐요! 케이크 같은 맛이 나요." },
        { who: "me", en: "It's sweet and creamy. I love it!", ko: "달콤하고 부드러워요. 너무 좋아요!", wrong: ["It's sour and salty. I hate it!", "It's sweet and sleepy."] }
      ],
      words: [["egg", "달걀"], ["iced", "얼음을 넣은"], ["taste", "맛이 나다, 맛"], ["sweet", "달콤한"], ["creamy", "크림처럼 부드러운"]],
      key: "Two egg coffees, please.",
      teaser: "린이 말하길, 주말 밤에는 구시가지 거리가 통째로 '야시장'이 된대요. 그리고 거기서는 값을 깎아도 된다는데..."
    },
    {
      title: "주말 야시장", icon: "🏮",
      intro: "주말 저녁, 구시가지 큰길에 차가 다니지 않고 야시장이 열렸어요. 옷, 가방, 기념품이 가득해요. 시장에서는 값을 조금 깎는 일이 흔해요.",
      lines: [
        { who: "me", en: "How much is this bag?", ko: "이 가방 얼마예요?", wrong: ["How old is this bag?", "Where is this bag?"] },
        { who: "npc", name: "상인", en: "Three hundred thousand dong.", ko: "30만 동이에요." },
        { who: "me", en: "That's too expensive. Can you give me a discount?", ko: "너무 비싸요. 좀 깎아 주실래요?", wrong: ["That's too cheap. Can you give me more?", "That's too big. Can you give me a map?"] },
        { who: "npc", name: "상인", en: "Okay, two hundred fifty thousand.", ko: "좋아요, 25만 동." },
        { who: "me", en: "How about two hundred thousand?", ko: "20만 동은 어때요?", wrong: ["How about two hundred bags?", "How are you two hundred?"] },
        { who: "npc", name: "상인", en: "Hmm... okay, deal!", ko: "음... 좋아요, 그렇게 해요!" }
      ],
      words: [["bag", "가방"], ["expensive", "비싼"], ["cheap", "싼"], ["how about", "~는 어때요?"], ["deal", "거래, 좋아요(합의)"]],
      key: "Can you give me a discount?",
      teaser: "가방을 싸게 사서 신났는데... 그날 밤, 길거리 음식을 너무 많이 먹었는지 배가 살살 아파 와요. 약국이 어디 있지?"
    },
    {
      title: "약국에서", icon: "💊",
      intro: "아침에 일어나니 배가 아파요. 린에게 연락했더니 호텔 근처 약국을 알려 줬어요. 약사에게 증상을 말해 봐요.",
      lines: [
        { who: "npc", name: "약사", en: "Hello. How can I help you?", ko: "안녕하세요. 어떻게 도와드릴까요?" },
        { who: "me", en: "I have a stomachache.", ko: "배가 아파요.", wrong: ["I have a stomach bag.", "I have a headache hat."] },
        { who: "npc", name: "약사", en: "Since when?", ko: "언제부터요?" },
        { who: "me", en: "Since last night.", ko: "어젯밤부터요.", wrong: ["Since last nice.", "Since next year."] },
        { who: "npc", name: "약사", en: "Take this medicine after meals, three times a day.", ko: "이 약을 하루 세 번, 식사 후에 드세요." },
        { who: "me", en: "Three times a day. Thank you.", ko: "하루 세 번이요. 감사합니다.", wrong: ["Three times a week. No, thanks.", "Three tickets a day. Thank you."] }
      ],
      words: [["pharmacy", "약국"], ["stomachache", "복통"], ["since", "~부터"], ["medicine", "약"], ["meal", "식사"]],
      key: "I have a stomachache.",
      teaser: "약을 먹고 푹 자고 나니 다 나았어요! 마지막 날, 린이 깜짝 제안을 해요. '하롱베이에 같이 가 볼래요?'"
    },
    {
      title: "하롱베이와 작별", icon: "⛵",
      intro: "하롱베이는 바다 위에 수많은 바위섬이 솟아 있는 곳이에요. 하노이에서 버스로 몇 시간 가면 돼요. 배 위에서 바다를 보며 린과 마지막 이야기를 나눠요.",
      lines: [
        { who: "npc", name: "가이드", en: "Welcome aboard! The boat leaves in ten minutes.", ko: "승선을 환영해요! 배는 10분 뒤에 출발해요." },
        { who: "me", en: "What time do we come back?", ko: "몇 시에 돌아와요?", wrong: ["What time do we eat back?", "What color is the boat?"] },
        { who: "npc", name: "가이드", en: "We come back at four o'clock.", ko: "4시에 돌아와요." },
        { who: "npc", name: "Linh", en: "So, did you enjoy Hanoi?", ko: "그래서, 하노이 즐거웠어요?" },
        { who: "me", en: "Yes, I had a great time. Thank you for everything, Linh.", ko: "네, 정말 즐거웠어요. 모든 게 고마워요, 린.", wrong: ["Yes, I had a great bag. Sorry, Linh.", "No, I had a stomach. Thank you, Linh."] },
        { who: "npc", name: "Linh", en: "Come back again! Have a safe trip home.", ko: "또 와요! 집까지 조심히 가요." }
      ],
      words: [["boat", "배"], ["island", "섬"], ["come back", "돌아오다"], ["enjoy", "즐기다"], ["safe", "안전한"]],
      key: "What time do we come back?",
      teaser: "집으로 가는 비행기 안. 여권을 펼치니 시드니 도장 옆에 하노이 도장이 나란히 찍혀 있어요. 다음엔 또 어디로 떠날까요?"
    }
  ];
  EPS.forEach(function (ep) { S.episodes.push(ep); });
  S.trips = S.trips || [{ city: S.city, country: S.country, flag: S.flag, stamp: "SYDNEY", from: 0, to: from - 1 }];
  S.trips.push({ city: "하노이", country: "베트남", flag: "🇻🇳", stamp: "HANOI", from: from, to: S.episodes.length - 1 });

  // 이 여행의 단어를 단어장 뒤에 붙임 (이미 있는 단어는 그 번호를 씀)
  var W = window.WORDS;
  EPS.forEach(function (ep, k) {
    var n = from + k;
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
