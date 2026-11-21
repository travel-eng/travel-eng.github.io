// 단어 파닉스 사전 (미국식 발음 기준)
// 형식: 단어|발음기호|한글로 비슷하게|글자=소리 묶음|팁(없어도 됨)
// 한글 표기는 "비슷한 소리"일 뿐 정확한 발음은 아니에요. 꼭 🔊로 들어 보세요.
// 굵게 읽는 부분(강세)은 발음기호의 ˈ 표시 뒤 음절이에요.
window.PHONICS_RAW = `
a|ə|어|a=어|문장 속에서는 약하게 '어'라고 짧게 말해요.
address|ˈæd.rɛs|애드레스|a=애 dd=ㄷ r=ㄹ e=에 ss=ㅅ|명사는 앞 '애'를 세게 읽어요.
again|əˈɡɛn|어겐|a=어 g=ㄱ ai=에 n=ㄴ|ai가 '에'로 소리 나요.
air|ɛr|에어|ai=에 r=어(r)|
airport|ˈɛr.pɔrt|에어포트|ai=에 r=어(r) p=ㅍ or=오어(r) t=ㅌ|
aisle|aɪl|아일|ai=아이 s=(소리 안 남) le=ㄹ|s는 소리가 안 나요! I'll(아일)과 소리가 같아요.
allergic|əˈlɜr.dʒɪk|얼러직|a=어 ll=ㄹ er=어(r) g=ㅈ i=이 c=ㅋ|
allergy|ˈæl.ər.dʒi|앨러지|a=애 ll=ㄹ er=어(r) g=ㅈ y=이|한국식 '알레르기'와 많이 달라요.
and|ænd|앤드|a=애 n=ㄴ d=ㄷ|빨리 말할 때는 '은/언'처럼 짧아져요.
any|ˈɛn.i|에니|a=에 n=ㄴ y=이|a가 '에'로 소리 나는 특이한 단어예요.
anything|ˈɛn.i.θɪŋ|에니씽|a=에 n=ㄴ y=이 th=ㅆ(th) i=이 ng=ㅇ|
around|əˈraʊnd|어라운드|a=어 r=ㄹ(r) ou=아우 n=ㄴ d=ㄷ|
as|æz|애즈|a=애 s=ㅈ|
at|æt|앳|a=애 t=ㅌ|
available|əˈveɪ.lə.bəl|어베일러블|a=어 v=ㅂ(v) ai=에이 l=ㄹ a=어 b=ㅂ le=을|
bag|bæɡ|백|b=ㅂ a=애 g=ㄱ|
baggage|ˈbæɡ.ɪdʒ|배기지|b=ㅂ a=애 gg=ㄱ a=이 ge=지|
bags|bæɡz|백즈|b=ㅂ a=애 g=ㄱ s=ㅈ|
beach|biːtʃ|비-치|b=ㅂ ea=이- ch=치|길게 '이-'. 짧게 하면 다른 단어가 되니 꼭 길게!
beautiful|ˈbjuː.tɪ.fəl|뷰-티풀|b=ㅂ eau=유- t=ㅌ i=이 f=ㅍ(f) ul=얼|미국에서는 t가 'ㄹ'처럼 '뷰-리풀'로도 들려요.
bill|bɪl|빌|b=ㅂ i=이 ll=ㄹ|
black|blæk|블랙|b=ㅂ l=ㄹ a=애 ck=ㅋ|
boarding|ˈbɔr.dɪŋ|보딩|b=ㅂ oar=오어(r) d=ㄷ i=이 ng=ㅇ|
book|bʊk|북|b=ㅂ oo=우 k=ㅋ|
breakfast|ˈbrɛk.fəst|브렉퍼스트|b=ㅂ r=ㄹ(r) ea=에 k=ㅋ f=ㅍ(f) a=어 s=ㅅ t=ㅌ|ea가 '에'예요. '브레이크'가 아니에요.
bus|bʌs|버스|b=ㅂ u=어 s=ㅅ|
by|baɪ|바이|b=ㅂ y=아이|
call|kɔl|콜|c=ㅋ a=오 ll=ㄹ|
can|kæn|캔|c=ㅋ a=애 n=ㄴ|문장 속에서는 약하게 '컨'으로 들려요.
card|kɑrd|카드|c=ㅋ ar=아(r) d=ㄷ|
cash|kæʃ|캐시|c=ㅋ a=애 sh=시|
center|ˈsɛn.tər|센터|c=ㅅ e=에 n=ㄴ t=ㅌ er=어(r)|e/i 앞의 c는 'ㅅ' 소리예요.
change|tʃeɪndʒ|체인지|ch=ㅊ a=에이 n=ㄴ ge=지|
cheap|tʃiːp|치-프|ch=ㅊ ea=이- p=ㅍ|
cheaper|ˈtʃiː.pər|치-퍼|ch=ㅊ ea=이- p=ㅍ er=어(r)|
check|tʃɛk|첵|ch=ㅊ e=에 ck=ㅋ|
checkout|ˈtʃɛk.aʊt|체카웃|ch=ㅊ e=에 ck=ㅋ ou=아우 t=ㅌ|
city|ˈsɪt.i|시티|c=ㅅ i=이 t=ㅌ y=이|미국에서는 '시리'처럼도 들려요.
close|kloʊz|클로우즈|c=ㅋ l=ㄹ o=오우 s=ㅈ e=(소리 안 남)|'닫다'는 s가 'ㅈ' 소리예요.
coffee|ˈkɔ.fi|커-피|c=ㅋ o=오/아 ff=ㅍ(f) ee=이|
cold|koʊld|코울드|c=ㅋ o=오우 l=ㄹ d=ㄷ|
come|kʌm|컴|c=ㅋ o=어 m=ㅁ e=(소리 안 남)|
conditioner|kənˈdɪʃ.ən.ər|컨디셔너|c=ㅋ o=어 n=ㄴ d=ㄷ i=이 ti=시 o=어 n=ㄴ er=어(r)|
contact|ˈkɑn.tækt|칸택트|c=ㅋ o=아 n=ㄴ t=ㅌ a=애 c=ㅋ t=ㅌ|
corner|ˈkɔr.nər|코너|c=ㅋ or=오어(r) n=ㄴ er=어(r)|
could|kʊd|쿠드|c=ㅋ ou=우 l=(소리 안 남) d=ㄷ|l은 소리가 안 나요!
days|deɪz|데이즈|d=ㄷ ay=에이 s=ㅈ|
decide|dɪˈsaɪd|디사이드|d=ㄷ e=이 c=ㅅ i=아이 d=ㄷ e=(소리 안 남)|
delay|dɪˈleɪ|딜레이|d=ㄷ e=이 l=ㄹ ay=에이|
delayed|dɪˈleɪd|딜레이드|d=ㄷ e=이 l=ㄹ ay=에이 ed=ㄷ|
delicious|dɪˈlɪʃ.əs|딜리셔스|d=ㄷ e=이 l=ㄹ i=이 ci=시 ou=어 s=ㅅ|
didn't|ˈdɪd.ənt|디든트|d=ㄷ i=이 d=ㄷ n't=은트|did not을 줄인 말이에요.
dinner|ˈdɪn.ər|디너|d=ㄷ i=이 nn=ㄴ er=어(r)|
discount|ˈdɪs.kaʊnt|디스카운트|d=ㄷ i=이 s=ㅅ c=ㅋ ou=아우 n=ㄴ t=ㅌ|
do|duː|두-|d=ㄷ o=우-|
doctor|ˈdɑk.tər|닥터|d=ㄷ o=아 c=ㅋ t=ㅌ or=어(r)|미국식은 '독터'보다 '닥터'에 가까워요.
does|dʌz|더즈|d=ㄷ oe=어 s=ㅈ|'도에스'가 아니라 '더즈'예요.
don't|doʊnt|도운트|d=ㄷ o=오우 n't=은트|do not을 줄인 말이에요.
down|daʊn|다운|d=ㄷ ow=아우 n=ㄴ|
downtown|ˌdaʊnˈtaʊn|다운타운|d=ㄷ ow=아우 n=ㄴ t=ㅌ ow=아우 n=ㄴ|
early|ˈɜr.li|얼리|ear=어(r) l=ㄹ y=이|
elevator|ˈɛl.ə.veɪ.tər|엘러베이터|e=에 l=ㄹ e=어 v=ㅂ(v) a=에이 t=ㅌ or=어(r)|
embassy|ˈɛm.bə.si|엠버시|e=에 m=ㅁ b=ㅂ a=어 ss=ㅅ y=이|
english|ˈɪŋ.ɡlɪʃ|잉글리시|E=이 ng=ㅇ g=ㄱ l=ㄹ i=이 sh=시|
entrance|ˈɛn.trəns|엔트런스|e=에 n=ㄴ t=ㅌ r=ㄹ(r) a=어 n=ㄴ ce=ㅅ|
excuse|ɪkˈskjuːz|익스큐-즈|e=이 x=ㅋㅅ c=ㅋ u=유- s=ㅈ e=(소리 안 남)|'실례합니다'일 때는 끝이 'ㅈ' 소리예요.
exit|ˈɛɡ.zɪt|에그짓|e=에 x=ㄱㅈ i=이 t=ㅌ|'엑싯'이라고 해도 통해요.
expensive|ɪkˈspɛn.sɪv|익스펜시브|e=이 x=ㅋㅅ p=ㅍ e=에 n=ㄴ s=ㅅ i=이 ve=ㅂ(v)|
far|fɑr|파-(r)|f=ㅍ(f) ar=아(r)|
feel|fiːl|피-일|f=ㅍ(f) ee=이- l=ㄹ|
fever|ˈfiː.vər|피-버|f=ㅍ(f) e=이- v=ㅂ(v) er=어(r)|
fi|faɪ|파이|f=ㅍ(f) i=아이|
five|faɪv|파이브|f=ㅍ(f) i=아이 v=ㅂ(v) e=(소리 안 남)|
flight|flaɪt|플라이트|f=ㅍ(f) l=ㄹ igh=아이 t=ㅌ|gh는 소리가 안 나요.
floor|flɔr|플로어|f=ㅍ(f) l=ㄹ oor=오어(r)|
for|fɔr|포어|f=ㅍ(f) or=오어(r)|문장 속에서는 약하게 '퍼'로 들려요.
free|friː|프리-|f=ㅍ(f) r=ㄹ(r) ee=이-|
friend|frɛnd|프렌드|f=ㅍ(f) r=ㄹ(r) ie=에 n=ㄴ d=ㄷ|ie가 '에'예요.
from|frʌm|프럼|f=ㅍ(f) r=ㄹ(r) o=어 m=ㅁ|
gate|ɡeɪt|게이트|g=ㄱ a=에이 t=ㅌ e=(소리 안 남)|
get|ɡɛt|겟|g=ㄱ e=에 t=ㅌ|
gift|ɡɪft|기프트|g=ㄱ i=이 f=ㅍ(f) t=ㅌ|
go|ɡoʊ|고우|g=ㄱ o=오우|'고'보다 '고우'에 가까워요.
good|ɡʊd|굿|g=ㄱ oo=우 d=ㄷ|
have|hæv|해브|h=ㅎ a=애 ve=ㅂ(v)|
headache|ˈhɛd.eɪk|헤데이크|h=ㅎ ea=에 d=ㄷ a=에이 ch=ㅋ e=(소리 안 남)|ch가 'ㅋ' 소리예요.
hello|həˈloʊ|헐로우|h=ㅎ e=어 ll=ㄹ o=오우|
help|hɛlp|헬프|h=ㅎ e=에 l=ㄹ p=ㅍ|
here|hɪr|히어|h=ㅎ ere=이어(r)|
hospital|ˈhɑs.pɪ.təl|하스피틀|h=ㅎ o=아 s=ㅅ p=ㅍ i=이 t=ㅌ al=을|
hotel|hoʊˈtɛl|호우텔|h=ㅎ o=오우 t=ㅌ e=에 l=ㄹ|뒤 '텔'을 세게 읽어요.
how|haʊ|하우|h=ㅎ ow=아우|
i|aɪ|아이|I=아이|
i'd|aɪd|아이드|I=아이 'd=ㄷ|I would를 줄인 말이에요.
i'll|aɪl|아일|I=아이 'll=ㄹ|I will을 줄인 말이에요.
i'm|aɪm|아임|I=아이 'm=ㅁ|I am을 줄인 말이에요.
in|ɪn|인|i=이 n=ㄴ|
included|ɪnˈkluː.dɪd|인클루-디드|i=이 n=ㄴ c=ㅋ l=ㄹ u=우- d=ㄷ e=이 d=ㄷ|
is|ɪz|이즈|i=이 s=ㅈ|s가 'ㅈ' 소리예요.
it|ɪt|잇|i=이 t=ㅌ|
it's|ɪts|잇츠|i=이 t's=ㅊ|It is를 줄인 말이에요.
just|dʒʌst|저스트|j=ㅈ u=어 s=ㅅ t=ㅌ|
keep|kiːp|키-프|k=ㅋ ee=이- p=ㅍ|
key|kiː|키-|k=ㅋ ey=이-|
know|noʊ|노우|k=(소리 안 남) n=ㄴ ow=오우|k는 소리가 안 나요! no와 소리가 같아요.
korean|kəˈriː.ən|커리-언|K=ㅋ o=어 r=ㄹ(r) e=이- a=언|'코리안'보다 '커리-언'에 가까워요.
late|leɪt|레이트|l=ㄹ a=에이 t=ㅌ e=(소리 안 남)|
leave|liːv|리-브|l=ㄹ ea=이- ve=ㅂ(v)|
leaving|ˈliː.vɪŋ|리-빙|l=ㄹ ea=이- v=ㅂ(v) i=이 ng=ㅇ|
left|lɛft|레프트|l=ㄹ e=에 f=ㅍ(f) t=ㅌ|
let|lɛt|렛|l=ㄹ e=에 t=ㅌ|
let's|lɛts|렛츠|l=ㄹ e=에 t's=ㅊ|Let us를 줄인 말이에요. '~하자'라는 뜻.
like|laɪk|라이크|l=ㄹ i=아이 k=ㅋ e=(소리 안 남)|
little|ˈlɪt.əl|리틀|l=ㄹ i=이 tt=ㅌ le=을|미국에서는 '리를'처럼도 들려요.
locked|lɑkt|락트|l=ㄹ o=아 ck=ㅋ ed=ㅌ|ed가 'ㅌ' 소리예요.
long|lɔŋ|롱|l=ㄹ o=오 ng=ㅇ|
looking|ˈlʊk.ɪŋ|루킹|l=ㄹ oo=우 k=ㅋ i=이 ng=ㅇ|
lost|lɔst|로스트|l=ㄹ o=오 s=ㅅ t=ㅌ|
lunch|lʌntʃ|런치|l=ㄹ u=어 n=ㄴ ch=치|
map|mæp|맵|m=ㅁ a=애 p=ㅍ|
me|miː|미-|m=ㅁ e=이-|
medicine|ˈmɛd.ɪ.sən|메디슨|m=ㅁ e=에 d=ㄷ i=이 c=ㅅ ine=언|
meet|miːt|미-트|m=ㅁ ee=이- t=ㅌ|
menu|ˈmɛn.juː|메뉴-|m=ㅁ e=에 n=ㄴ u=유-|
minute|ˈmɪn.ɪt|미닛|m=ㅁ i=이 n=ㄴ u=이 t=ㅌ e=(소리 안 남)|
minutes|ˈmɪn.ɪts|미니츠|m=ㅁ i=이 n=ㄴ u=이 t=ㅌ es=ㅊ|
money|ˈmʌn.i|머니|m=ㅁ o=어 n=ㄴ ey=이|
more|mɔr|모어|m=ㅁ ore=오어(r)|
much|mʌtʃ|머치|m=ㅁ u=어 ch=치|
museum|mjuˈziː.əm|뮤지-엄|m=ㅁ u=유 s=ㅈ e=이- um=엄|가운데 '지'를 세게 읽어요.
my|maɪ|마이|m=ㅁ y=아이|
myself|maɪˈsɛlf|마이셀프|m=ㅁ y=아이 s=ㅅ e=에 l=ㄹ f=ㅍ(f)|
near|nɪr|니어|n=ㄴ ear=이어(r)|
nearest|ˈnɪr.ɪst|니어리스트|n=ㄴ ear=이어(r) e=이 s=ㅅ t=ㅌ|
need|niːd|니-드|n=ㄴ ee=이- d=ㄷ|
nice|naɪs|나이스|n=ㄴ i=아이 c=ㅅ e=(소리 안 남)|
no|noʊ|노우|n=ㄴ o=오우|
not|nɑt|낫|n=ㄴ o=아 t=ㅌ|
of|ʌv|어브|o=어 f=ㅂ(v)|f가 'v' 소리예요.
okay|ˌoʊˈkeɪ|오우케이|o=오우 k=ㅋ ay=에이|
on|ɑn|안|o=아 n=ㄴ|미국식은 '온'보다 '안'에 가까워요.
one|wʌn|원|o=우어 n=ㄴ e=(소리 안 남)|철자와 소리가 많이 다른 단어예요.
open|ˈoʊ.pən|오우픈|o=오우 p=ㅍ e=어 n=ㄴ|
out|aʊt|아웃|ou=아우 t=ㅌ|
over|ˈoʊ.vər|오우버|o=오우 v=ㅂ(v) er=어(r)|
pass|pæs|패스|p=ㅍ a=애 ss=ㅅ|
passport|ˈpæs.pɔrt|패스포트|p=ㅍ a=애 ss=ㅅ p=ㅍ or=오어(r) t=ㅌ|
password|ˈpæs.wɜrd|패스워드|p=ㅍ a=애 ss=ㅅ w=우 or=어(r) d=ㄷ|
pay|peɪ|페이|p=ㅍ ay=에이|
peanut|ˈpiː.nʌt|피-넛|p=ㅍ ea=이- n=ㄴ u=어 t=ㅌ|
peanuts|ˈpiː.nʌts|피-너츠|p=ㅍ ea=이- n=ㄴ u=어 ts=ㅊ|
pharmacy|ˈfɑr.mə.si|파머시|ph=ㅍ(f) ar=아(r) m=ㅁ a=어 c=ㅅ y=이|ph는 f 소리예요.
phone|foʊn|포운|ph=ㅍ(f) o=오우 n=ㄴ e=(소리 안 남)|ph는 f 소리예요.
photo|ˈfoʊ.toʊ|포우토우|ph=ㅍ(f) o=오우 t=ㅌ o=오우|ph는 f 소리예요.
pick|pɪk|픽|p=ㅍ i=이 ck=ㅋ|
place|pleɪs|플레이스|p=ㅍ l=ㄹ a=에이 c=ㅅ e=(소리 안 남)|
please|pliːz|플리-즈|p=ㅍ l=ㄹ ea=이- s=ㅈ e=(소리 안 남)|끝이 'ㅅ'가 아니라 'ㅈ' 소리예요.
police|pəˈliːs|펄리-스|p=ㅍ o=어 l=ㄹ i=이- c=ㅅ e=(소리 안 남)|뒤 '리-'를 세게 읽어요.
receipt|rɪˈsiːt|리시-트|r=ㄹ(r) e=이 c=ㅅ ei=이- p=(소리 안 남) t=ㅌ|p는 소리가 안 나요! '리십트'가 아니에요.
recommend|ˌrɛk.əˈmɛnd|레커멘드|r=ㄹ(r) e=에 c=ㅋ o=어 mm=ㅁ e=에 n=ㄴ d=ㄷ|
refund|ˈriː.fʌnd|리-펀드|r=ㄹ(r) e=이- f=ㅍ(f) u=어 n=ㄴ d=ㄷ|
report|rɪˈpɔrt|리포트|r=ㄹ(r) e=이 p=ㅍ or=오어(r) t=ㅌ|
reservation|ˌrɛz.ərˈveɪ.ʃən|레저베이션|r=ㄹ(r) e=에 s=ㅈ er=어(r) v=ㅂ(v) a=에이 tion=션|
restroom|ˈrɛst.ruːm|레스트룸|r=ㄹ(r) e=에 s=ㅅ t=ㅌ r=ㄹ(r) oo=우- m=ㅁ|
return|rɪˈtɜrn|리턴|r=ㄹ(r) e=이 t=ㅌ ur=어(r) n=ㄴ|
right|raɪt|라이트|r=ㄹ(r) igh=아이 t=ㅌ|gh는 소리가 안 나요.
room|ruːm|룸|r=ㄹ(r) oo=우- m=ㅁ|
say|seɪ|세이|s=ㅅ ay=에이|
seat|siːt|시-트|s=ㅅ ea=이- t=ㅌ|
see|siː|시-|s=ㅅ ee=이-|
should|ʃʊd|슈드|sh=시 ou=우 l=(소리 안 남) d=ㄷ|l은 소리가 안 나요!
show|ʃoʊ|쇼우|sh=시 ow=오우|
sightseeing|ˈsaɪt.siː.ɪŋ|사이트시-잉|s=ㅅ igh=아이 t=ㅌ s=ㅅ ee=이- i=이 ng=ㅇ|
sit|sɪt|싯|s=ㅅ i=이 t=ㅌ|
size|saɪz|사이즈|s=ㅅ i=아이 z=ㅈ e=(소리 안 남)|
slowly|ˈsloʊ.li|슬로울리|s=ㅅ l=ㄹ ow=오우 l=ㄹ y=이|
smaller|ˈsmɔ.lər|스몰러|s=ㅅ m=ㅁ a=오 ll=ㄹ er=어(r)|
so|soʊ|소우|s=ㅅ o=오우|
some|sʌm|섬|s=ㅅ o=어 m=ㅁ e=(소리 안 남)|
sorry|ˈsɑr.i|사리|s=ㅅ o=아 rr=ㄹ(r) y=이|미국식은 '쏘리'보다 '사-리'에 가까워요.
sounds|saʊndz|사운즈|s=ㅅ ou=아우 n=ㄴ d=ㄷ s=ㅈ|ou는 '아우'. 끝 ds는 '즈'로 붙여서 말해요.
speak|spiːk|스피-크|s=ㅅ p=ㅍ ea=이- k=ㅋ|
spicy|ˈspaɪ.si|스파이시|s=ㅅ p=ㅍ i=아이 c=ㅅ y=이|
station|ˈsteɪ.ʃən|스테이션|s=ㅅ t=ㅌ a=에이 tion=션|tion은 '션'이에요.
stay|steɪ|스테이|s=ㅅ t=ㅌ ay=에이|
staying|ˈsteɪ.ɪŋ|스테잉|s=ㅅ t=ㅌ ay=에이 i=이 ng=ㅇ|
stolen|ˈstoʊ.lən|스토울런|s=ㅅ t=ㅌ o=오우 l=ㄹ e=어 n=ㄴ|
stop|stɑp|스탑|s=ㅅ t=ㅌ o=아 p=ㅍ|
straight|streɪt|스트레이트|s=ㅅ t=ㅌ r=ㄹ(r) aigh=에이 t=ㅌ|gh는 소리가 안 나요.
street|striːt|스트리-트|s=ㅅ t=ㅌ r=ㄹ(r) ee=이- t=ㅌ|
subway|ˈsʌb.weɪ|섭웨이|s=ㅅ u=어 b=ㅂ w=우 ay=에이|
table|ˈteɪ.bəl|테이블|t=ㅌ a=에이 b=ㅂ le=을|
take|teɪk|테이크|t=ㅌ a=에이 k=ㅋ e=(소리 안 남)|
takes|teɪks|테잌스|t=ㅌ a=에이 k=ㅋ es=ㅅ|
tax|tæks|택스|t=ㅌ a=애 x=ㅋㅅ|
taxi|ˈtæk.si|택시|t=ㅌ a=애 x=ㅋㅅ i=이|
tell|tɛl|텔|t=ㅌ e=에 ll=ㄹ|
ten|tɛn|텐|t=ㅌ e=에 n=ㄴ|
thank|θæŋk|쌩크|th=ㅆ(th) a=애 n=ㅇ k=ㅋ|th는 혀끝을 윗니에 살짝 대고 바람을 내보내요.
thanks|θæŋks|쌩스|th=ㅆ(th) a=애 n=ㅇ k=ㅋ s=ㅅ|th는 혀끝을 윗니에 살짝 대고 바람을 내보내요.
that|ðæt|댓|th=ㄷ(th) a=애 t=ㅌ|이 th는 혀를 이 사이에 두고 'ㄷ'처럼 소리 내요.
the|ðə|더|th=ㄷ(th) e=어|이 th는 혀를 이 사이에 두고 'ㄷ'처럼 소리 내요.
there|ðɛr|데어|th=ㄷ(th) ere=에어(r)|
third|θɜrd|써드|th=ㅆ(th) ir=어(r) d=ㄷ|
this|ðɪs|디스|th=ㄷ(th) i=이 s=ㅅ|이 th는 혀를 이 사이에 두고 'ㄷ'처럼 소리 내요.
ticket|ˈtɪk.ɪt|티킷|t=ㅌ i=이 ck=ㅋ e=이 t=ㅌ|
time|taɪm|타임|t=ㅌ i=아이 m=ㅁ e=(소리 안 남)|
tip|tɪp|팁|t=ㅌ i=이 p=ㅍ|
to|tuː|투-|t=ㅌ o=우-|문장 속에서는 약하게 '터'로 들려요.
today|təˈdeɪ|터데이|t=ㅌ o=어 d=ㄷ ay=에이|뒤 '데이'를 세게 읽어요.
tomorrow|təˈmɑr.oʊ|터마로우|t=ㅌ o=어 m=ㅁ o=아 rr=ㄹ(r) ow=오우|
too|tuː|투-|t=ㅌ oo=우-|to, two와 소리가 같아요.
towel|ˈtaʊ.əl|타월|t=ㅌ ow=아우 e=어 l=ㄹ|
try|traɪ|트라이|t=ㅌ r=ㄹ(r) y=아이|tr은 '츄'처럼도 들려요.
turn|tɜrn|턴|t=ㅌ ur=어(r) n=ㄴ|
two|tuː|투-|t=ㅌ w=(소리 안 남) o=우-|w는 소리가 안 나요.
understand|ˌʌn.dərˈstænd|언더스탠드|u=어 n=ㄴ d=ㄷ er=어(r) s=ㅅ t=ㅌ a=애 n=ㄴ d=ㄷ|
up|ʌp|업|u=어 p=ㅍ|
us|ʌs|어스|u=어 s=ㅅ|
use|juːz|유-즈|u=유- s=ㅈ e=(소리 안 남)|'사용하다'는 끝이 'ㅈ' 소리예요.
very|ˈvɛr.i|베리|v=ㅂ(v) e=에 r=ㄹ(r) y=이|
view|vjuː|뷰-|v=ㅂ(v) iew=유-|
wait|weɪt|웨이트|w=우 ai=에이 t=ㅌ|
walk|wɔk|웍|w=우 a=오 l=(소리 안 남) k=ㅋ|l은 소리가 안 나요! '워크'(work)와 달라요.
wallet|ˈwɑl.ɪt|왈릿|w=우 a=아 ll=ㄹ e=이 t=ㅌ|
was|wʌz|워즈|w=우 a=어 s=ㅈ|
water|ˈwɔ.tər|워터|w=우 a=오 t=ㅌ er=어(r)|미국에서는 '워러'처럼도 들려요.
we|wiː|위-|w=우 e=이-|
weather|ˈwɛð.ər|웨더|w=우 ea=에 th=ㄷ(th) er=어(r)|
well|wɛl|웰|w=우 e=에 ll=ㄹ|
what|wʌt|왓|wh=우 a=어 t=ㅌ|h는 소리가 안 나요.
what's|wʌts|왓츠|wh=우 a=어 t's=ㅊ|What is를 줄인 말이에요.
when|wɛn|웬|wh=우 e=에 n=ㄴ|
where|wɛr|웨어|wh=우 ere=에어(r)|
which|wɪtʃ|위치|wh=우 i=이 ch=치|
wi-fi|ˈwaɪ.faɪ|와이파이|w=우 i=아이 f=ㅍ(f) i=아이|
will|wɪl|윌|w=우 i=이 ll=ㄹ|
window|ˈwɪn.doʊ|윈도우|w=우 i=이 n=ㄴ d=ㄷ ow=오우|
working|ˈwɜr.kɪŋ|워킹|w=우 or=어(r) k=ㅋ i=이 ng=ㅇ|
wrap|ræp|랩|w=(소리 안 남) r=ㄹ(r) a=애 p=ㅍ|w는 소리가 안 나요.
write|raɪt|라이트|w=(소리 안 남) r=ㄹ(r) i=아이 t=ㅌ e=(소리 안 남)|w는 소리가 안 나요. right와 소리가 같아요.
yes|jɛs|예스|y=이 e=에 s=ㅅ|
you|juː|유-|y=이 ou=우-|
your|jɔr|유어|y=이 our=오어(r)|
you're|jɔr|유어|y=이 ou're=오어(r)|You are를 줄인 말이에요.
about|əˈbaʊt|어바웃|a=어 b=ㅂ ou=아우 t=ㅌ|
ah|ɑ|아|ah=아|
amazing|əˈmeɪ.zɪŋ|어메이징|a=어 m=ㅁ a=에이 z=ㅈ i=이 ng=ㅇ|
an|ən|언|a=어 n=ㄴ|모음 소리 앞에서 a 대신 an을 써요.
are|ɑr|아-(r)|ar=아(r) e=(소리 안 남)|문장 속에서는 약하게 '어(r)'로 들려요.
australia|ɔˈstreɪl.jə|오스트레일리아|Au=오 s=ㅅ t=ㅌ r=ㄹ(r) a=에이 l=ㄹ ia=이어|호주 사람들은 '오스트레일리아'를 빠르게 '어스트레일야'처럼도 말해요.
back|bæk|백|b=ㅂ a=애 ck=ㅋ|
beef|biːf|비-프|b=ㅂ ee=이- f=ㅍ(f)|
between|bɪˈtwiːn|비트위-인|b=ㅂ e=이 t=ㅌ w=우 ee=이- n=ㄴ|
buy|baɪ|바이|b=ㅂ uy=아이|u는 소리가 안 나요. by, bye와 소리가 같아요.
cafe|kæˈfeɪ|캐페이|c=ㅋ a=애 f=ㅍ(f) e=에이|
can't|kænt|캔트|c=ㅋ a=애 n't=ㄴ트|can not을 줄인 말이에요. 호주·영국은 '칸트'처럼 말해요.
central|ˈsɛn.trəl|센트럴|c=ㅅ e=에 n=ㄴ t=ㅌ r=ㄹ(r) al=얼|
charge|tʃɑrdʒ|차-(r)지|ch=ㅊ ar=아(r) ge=지|
charger|ˈtʃɑr.dʒər|차-저|ch=ㅊ ar=아(r) g=ㅈ er=어(r)|
cheese|tʃiːz|치-즈|ch=ㅊ ee=이- s=ㅈ e=(소리 안 남)|
chicken|ˈtʃɪk.ɪn|치킨|ch=ㅊ i=이 ck=ㅋ e=이 n=ㄴ|
confirmation|ˌkɑn.fərˈmeɪ.ʃən|칸퍼메이션|c=ㅋ o=아 n=ㄴ f=ㅍ(f) ir=어(r) m=ㅁ a=에이 tion=션|
course|kɔrs|코어스|c=ㅋ our=오어(r) se=ㅅ|
credit|ˈkrɛd.ɪt|크레딧|c=ㅋ r=ㄹ(r) e=에 d=ㄷ i=이 t=ㅌ|
declare|dɪˈklɛr|디클레어|d=ㄷ e=이 c=ㅋ l=ㄹ are=에어(r)|
declaring|dɪˈklɛr.ɪŋ|디클레어링|d=ㄷ e=이 c=ㅋ l=ㄹ ar=에어(r) i=이 ng=ㅇ|
different|ˈdɪf.rənt|디프런트|d=ㄷ i=이 ff=ㅍ(f) e=(거의 안 들림) r=ㄹ(r) e=어 n=ㄴ t=ㅌ|가운데 e는 거의 안 들려서 세 음절이 아니라 '디프런트' 두 덩어리처럼 말해요.
dollar|ˈdɑl.ər|달러|d=ㄷ o=아 ll=ㄹ ar=어(r)|
dollars|ˈdɑl.ərz|달러즈|d=ㄷ o=아 ll=ㄹ ar=어(r) s=ㅈ|
dried|draɪd|드라이드|d=ㄷ r=ㄹ(r) ie=아이 d=ㄷ|
email|ˈiː.meɪl|이-메일|e=이- m=ㅁ ai=에이 l=ㄹ|
emma|ˈɛm.ə|에마|E=에 mm=ㅁ a=어|
enjoy|ɪnˈdʒɔɪ|인조이|e=이 n=ㄴ j=ㅈ oy=오이|
everything|ˈɛv.ri.θɪŋ|에브리씽|e=에 v=ㅂ(v) e=(소리 안 남) r=ㄹ(r) y=이 th=ㅆ(th) i=이 ng=ㅇ|
find|faɪnd|파인드|f=ㅍ(f) i=아이 n=ㄴ d=ㄷ|
fine|faɪn|파인|f=ㅍ(f) i=아이 n=ㄴ e=(소리 안 남)|
first|fɜrst|퍼-스트|f=ㅍ(f) ir=어(r) s=ㅅ t=ㅌ|
flag|flæɡ|플래그|f=ㅍ(f) l=ㄹ a=애 g=ㄱ|
flags|flæɡz|플래그즈|f=ㅍ(f) l=ㄹ a=애 g=ㄱ s=ㅈ|
flat|flæt|플랫|f=ㅍ(f) l=ㄹ a=애 t=ㅌ|
flying|ˈflaɪ.ɪŋ|플라잉|f=ㅍ(f) l=ㄹ y=아이 i=이 ng=ㅇ|
food|fuːd|푸-드|f=ㅍ(f) oo=우- d=ㄷ|
going|ˈɡoʊ.ɪŋ|고우잉|g=ㄱ o=오우 i=이 ng=ㅇ|
haven't|ˈhæv.ənt|해븐트|h=ㅎ a=애 v=ㅂ(v) e=어 n't=ㄴ트|have not을 줄인 말이에요.
hi|haɪ|하이|h=ㅎ i=아이|
if|ɪf|이프|i=이 f=ㅍ(f)|
isn't|ˈɪz.ənt|이즌트|i=이 s=ㅈ n't=은트|is not을 줄인 말이에요.
keyring|ˈkiː.rɪŋ|키-링|k=ㅋ ey=이- r=ㄹ(r) i=이 ng=ㅇ|
koala|koʊˈɑː.lə|코우알-러|k=ㅋ o=오우 a=아- l=ㄹ a=어|가운데 '알'을 세게 읽어요.
live|lɪv|리브|l=ㄹ i=이 ve=ㅂ(v)|'살다'는 짧은 '리브'. '라이브(생방송)'와 달라요.
love|lʌv|러브|l=ㄹ o=어 ve=ㅂ(v)|
lovely|ˈlʌv.li|러블리|l=ㄹ o=어 v=ㅂ(v) e=(소리 안 남) l=ㄹ y=이|
mate|meɪt|메이트|m=ㅁ a=에이 t=ㅌ e=(소리 안 남)|호주 사람들은 '마이트'처럼 발음하기도 해요.
may|meɪ|메이|m=ㅁ ay=에이|
milk|mɪlk|밀크|m=ㅁ i=이 l=ㄹ k=ㅋ|
miss|mɪs|미스|m=ㅁ i=이 ss=ㅅ|
morning|ˈmɔr.nɪŋ|모-닝|m=ㅁ or=오어(r) n=ㄴ i=이 ng=ㅇ|
name|neɪm|네임|n=ㄴ a=에이 m=ㅁ e=(소리 안 남)|
next|nɛkst|넥스트|n=ㄴ e=에 x=ㅋㅅ t=ㅌ|
off|ɔf|오프|o=오 ff=ㅍ(f)|
oh|oʊ|오우|oh=오우|
or|ɔr|오어|or=오어(r)|
platform|ˈplæt.fɔrm|플랫폼|p=ㅍ l=ㄹ a=애 t=ㅌ f=ㅍ(f) or=오어(r) m=ㅁ|
purpose|ˈpɜr.pəs|퍼-퍼스|p=ㅍ ur=어(r) p=ㅍ o=어 se=ㅅ|'퍼포즈'가 아니라 '퍼-퍼스'예요.
really|ˈriː.li|리-얼리|r=ㄹ(r) ea=이- ll=ㄹ y=이|
red|rɛd|레드|r=ㄹ(r) e=에 d=ㄷ|
safe|seɪf|세이프|s=ㅅ a=에이 f=ㅍ(f) e=(소리 안 남)|
seaweed|ˈsiː.wiːd|시-위-드|s=ㅅ ea=이- w=우 ee=이- d=ㄷ|
seven|ˈsɛv.ən|세븐|s=ㅅ e=에 v=ㅂ(v) e=어 n=ㄴ|
shop|ʃɑp|샵|sh=시 o=아 p=ㅍ|
soon|suːn|순-|s=ㅅ oo=우- n=ㄴ|
spelling|ˈspɛl.ɪŋ|스펠링|s=ㅅ p=ㅍ e=에 ll=ㄹ i=이 ng=ㅇ|
steamed|stiːmd|스팀-드|s=ㅅ t=ㅌ ea=이- m=ㅁ ed=ㄷ|
strong|strɔŋ|스트롱|s=ㅅ t=ㅌ r=ㄹ(r) o=오 ng=ㅇ|
sun|sʌn|선|s=ㅅ u=어 n=ㄴ|son(아들)과 소리가 같아요.
sunscreen|ˈsʌn.skriːn|선스크린-|s=ㅅ u=어 n=ㄴ s=ㅅ c=ㅋ r=ㄹ(r) ee=이- n=ㄴ|
sure|ʃʊr|슈어|s=시 ure=우어(r)|s가 '시' 소리예요.
swim|swɪm|스윔|s=ㅅ w=우 i=이 m=ㅁ|
swimsuit|ˈswɪm.suːt|스윔수-트|s=ㅅ w=우 i=이 m=ㅁ s=ㅅ ui=우- t=ㅌ|
sydney|ˈsɪd.ni|시드니|S=ㅅ y=이 d=ㄷ n=ㄴ ey=이|
tap|tæp|탭|t=ㅌ a=애 p=ㅍ|
that's|ðæts|댓츠|th=ㄷ(th) a=애 t's=ㅊ|That is를 줄인 말이에요.
there's|ðɛrz|데어즈|th=ㄷ(th) ere=에어(r) 's=ㅈ|There is를 줄인 말이에요.
thirty-five|ˈθɜr.di faɪv|써-디 파이브|th=ㅆ(th) ir=어(r) t=ㄷ y=이 f=ㅍ(f) i=아이 v=ㅂ(v) e=(소리 안 남)|미국에서는 thirty의 t가 'ㄷ/ㄹ'처럼 부드러워져요.
touch|tʌtʃ|터치|t=ㅌ ou=어 ch=치|ou가 '어'예요.
train|treɪn|트레인|t=ㅌ r=ㄹ(r) ai=에이 n=ㄴ|tr은 '츄'처럼도 들려요.
tried|traɪd|트라이드|t=ㅌ r=ㄹ(r) ie=아이 d=ㄷ|
trip|trɪp|트립|t=ㅌ r=ㄹ(r) i=이 p=ㅍ|
twenty|ˈtwɛn.ti|트웬티|t=ㅌ w=우 e=에 n=ㄴ t=ㅌ y=이|미국에서는 t가 빠져 '트웨니'처럼도 들려요.
under|ˈʌn.dər|언더|u=어 n=ㄴ d=ㄷ er=어(r)|
visit|ˈvɪz.ɪt|비짓|v=ㅂ(v) i=이 s=ㅈ i=이 t=ㅌ|s가 'ㅈ' 소리예요.
want|wɑnt|원트|w=우 a=아 n=ㄴ t=ㅌ|'원트'와 '완트' 사이 소리예요.
welcome|ˈwɛl.kəm|웰컴|w=우 e=에 l=ㄹ c=ㅋ o=어 m=ㅁ e=(소리 안 남)|
white|waɪt|와이트|wh=우 i=아이 t=ㅌ e=(소리 안 남)|
with|wɪð|위드|w=우 i=이 th=ㄷ(th)|
worries|ˈwɜr.iz|워-리즈|w=우 o=어 rr=ㄹ(r) ie=이 s=ㅈ|
would|wʊd|우드|w=우 ou=우 l=(소리 안 남) d=ㄷ|l은 소리가 안 나요! wood(나무)와 소리가 같아요.
wow|waʊ|와우|w=우 o=아 w=우|
yellow|ˈjɛl.oʊ|옐로우|y=이 e=에 ll=ㄹ ow=오우|
you'll|juːl|유-일|y=이 ou=우- 'll=ㄹ|You will을 줄인 말이에요.
across|əˈkrɔs|어크로스|a=어 c=ㅋ r=ㄹ(r) o=오 ss=ㅅ|
`;

// 소리 기호별 공통 팁
window.SOUND_TIPS = {
  "(r)": "r: 혀끝을 입천장에 닿지 않게 뒤로 살짝 말아요. 'ㄹ'보다 '우' 느낌이 섞여요.",
  "(th)": "th: 혀끝을 윗니와 아랫니 사이에 살짝 내밀고 소리 내요.",
  "(f)": "f: 윗니를 아랫입술에 살짝 대고 바람을 내보내요. 'ㅍ'처럼 입술을 붙이지 않아요.",
  "(v)": "v: f와 같은 입 모양에서 목을 울려요. 'ㅂ'처럼 입술을 붙이지 않아요.",
  "ㄹ_l": "l: 혀끝을 윗니 뒤 잇몸에 꾹 붙였다 떼요."
};
