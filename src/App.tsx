import React, { useState, useEffect } from 'react';
import './App.css';

// assets 이미지 불러오기
import pic1 from './assets/pic1.jpg';
import pic2 from './assets/pic2.jpg';
import pic3 from './assets/pic3.jpg';

interface BibleVerse {
  th: string;
  kr: string;
  refTh: string;
  refKr: string;
}

interface GospelStation {
  id: number;
  titleTh: string;
  titleKr: string;
  descTh: string;
  descKr: string;
  verseTh: string;
  verseKr: string;
  verseTextTh: string;
  verseTextKr: string;
}

interface UsefulLink {
  nameTh: string;
  nameKr: string;
  descTh: string;
  descKr: string;
  url: string;
  category: string;
}

interface RoomBill {
  id: number;
  name: string;
  usage: number;
  cost: number;
}

interface KoreanStudyItem {
  id: number;
  kr: string;
  thPron: string;
  thMeaning: string;
  enMeaning: string;
}

// 40개의 한국어 학습 데이터베이스
const koreanStudyDatabase: KoreanStudyItem[] = [
  { id: 1, kr: "안녕하세요", thPron: "อัน-นย็อง-ฮา-เซ-โย", thMeaning: "สวัสดี", enMeaning: "Hello" },
  { id: 2, kr: "감사합니다", thPron: "คัม-ซา-ฮัม-นิ-ดา", thMeaning: "ขอบคุณครับ/ค่ะ", enMeaning: "Thank you" },
  { id: 3, kr: "죄송합니다", thPron: "ชเว-ซง-ฮัม-นิ-ดา", thMeaning: "ขอโทษครับ/ค่ะ", enMeaning: "Sorry" },
  { id: 4, kr: "예수님", thPron: "เย-ซู-นิม", thMeaning: "พระเยซู", enMeaning: "Jesus" },
  { id: 5, kr: "사랑", thPron: "ซา-รัง", thMeaning: "ความรัก", enMeaning: "Love" },
  { id: 6, kr: "은혜", thPron: "อึน-เฮ", thMeaning: "พระคุณ", enMeaning: "Grace" },
  { id: 7, kr: "축복합니다", thPron: "ชุก-บก-ฮัม-นิ-ดา", thMeaning: "ขอพระเจ้าอวยพร", enMeaning: "God bless you" },
  { id: 8, kr: "기도", thPron: "คี-โด", thMeaning: "การอธิษฐาน / การอธิษฐานขอ", enMeaning: "Prayer" },
  { id: 9, kr: "믿음", thPron: "มี-ดึม", thMeaning: "ความเชื่อ", enMeaning: "Faith" },
  { id: 10, kr: "소망", thPron: "โซ-มัง", thMeaning: "ความหวัง", enMeaning: "Hope" },
  { id: 11, kr: "얼마예요?", thPron: "ออล-มา-เย-โย?", thMeaning: "ราคาเท่าไหร่ครับ/ค่ะ?", enMeaning: "How much is it?" },
  { id: 12, kr: "어디예요?", thPron: "ออ-ดิ-เย-โย?", thMeaning: "อยู่ที่ไหนครับ/ค่ะ?", enMeaning: "Where is it?" },
  { id: 13, kr: "도와주세요", thPron: "โท-วา-จู-เซ-โย", thMeaning: "ช่วยด้วยครับ/ค่ะ", enMeaning: "Please help me" },
  { id: 14, kr: "네 / 아니요", thPron: "เน / อา-นี-โย", thMeaning: "ใช่ / ไม่ใช่", enMeaning: "Yes / No" },
  { id: 15, kr: "괜찮아요", thPron: "แควน-ชา-นา-โย", thMeaning: "ไม่เป็นไรครับ/ค่ะ", enMeaning: "It's okay" },
  { id: 16, kr: "전기세", thPron: "ชอน-กี-เซ", thMeaning: "ค่าไฟฟ้า", enMeaning: "Electricity bill" },
  { id: 17, kr: "월세", thPron: "วอล-เซ", thMeaning: "ค่าเช่ารายเดือน", enMeaning: "Monthly rent" },
  { id: 18, kr: "수도세", thPron: "ซู-โด-เซ", thMeaning: "ค่าน้ำประปา", enMeaning: "Water bill" },
  { id: 19, kr: "영수증", thPron: "ย็อง-ซู-จึง", thMeaning: "ใบเสร็จรับเงิน", enMeaning: "Receipt" },
  { id: 20, kr: "계좌번호", thPron: "กเย-จวา-บอน-โฮ", thMeaning: "เลขที่บัญชี", enMeaning: "Account number" },
  { id: 21, kr: "밥 먹었어요?", thPron: "พับ ม็อก-ออส-ซอ-โย?", thMeaning: "ทานข้าวหรือยังครับ/ค่ะ?", enMeaning: "Have you eaten?" },
  { id: 22, kr: "맛있어요", thPron: "มา-ชิ-ซอ-โย", thMeaning: "อร่อยครับ/ค่ะ", enMeaning: "It's delicious" },
  { id: 23, kr: "어디 가요?", thPron: "ออ-ดิ กา-โย?", thMeaning: "จะไปไหนครับ/ค่ะ?", enMeaning: "Where are you going?" },
  { id: 24, kr: "집에 가요", thPron: "ชิบ-เบ กา-โย", thMeaning: "กลับบ้านครับ/ค่ะ", enMeaning: "Going home" },
  { id: 25, kr: "오늘", thPron: "โอ-นึล", thMeaning: "วันนี้", enMeaning: "Today" },
  { id: 26, kr: "내일", thPron: "เน-อิล", thMeaning: "พรุ่งนี้", enMeaning: "Tomorrow" },
  { id: 27, kr: "주일 (일요일)", thPron: "ชู-อิล (อิล-โย-อิล)", thMeaning: "วันอาทิตย์", enMeaning: "Sunday" },
  { id: 28, kr: "교회", thPron: "กโย-ฮเว", thMeaning: "โบสถ์", enMeaning: "Church" },
  { id: 29, kr: "성경", thPron: "ซ็อง-กย็อง", thMeaning: "พระคัมภีร์", enMeaning: "Bible" },
  { id: 30, kr: "찬양", thPron: "ชัน-ยัง", thMeaning: "การสรรเสริญ", enMeaning: "Praise" },
  { id: 31, kr: "평안하세요", thPron: "พย็อง-อัน-ฮา-เซ-โย", thMeaning: "ขอให้มีความสงบสุข", enMeaning: "Peace be with you" },
  { id: 32, kr: "수고하셨습니다", thPron: "ซู-โก-ฮา-ชยอส-ซึม-นิ-ดา", thMeaning: "เหน็ดเหนื่อยมามากแล้ว (ขอบคุณสำหรับความตั้งใจ)", enMeaning: "Good job / Thank you for your effort" },
  { id: 33, kr: "천국", thPron: "ชอน-กุก", thMeaning: "สวรรค์", enMeaning: "Heaven" },
  { id: 34, kr: "구원", thPron: "กู-วอน", thMeaning: "การช่วยให้รอด", enMeaning: "Salvation" },
  { id: 35, kr: "친구", thPron: "ชิน-กู", thMeaning: "เพื่อน", enMeaning: "Friend" },
  { id: 36, kr: "병원", thPron: "พย็อง-วอน", thMeaning: "โรงพยาบาล", enMeaning: "Hospital" },
  { id: 37, kr: "약국", thPron: "ยัก-กุก", thMeaning: "ร้านขายยา", enMeaning: "Pharmacy" },
  { id: 38, kr: "아파요", thPron: "อา-พา-โย", thMeaning: "เจ็บ / ป่วย", enMeaning: "It hurts / Sick" },
  { id: 39, kr: "피곤해요", thPron: "พี-กน-แฮ-โย", thMeaning: "เหนื่อยครับ/ค่ะ", enMeaning: "Tired" },
  { id: 40, kr: "행복하세요", thPron: "แฮง-บก-ฮา-เซ-โย", thMeaning: "ขอให้มีความสุข", enMeaning: "Be happy" }
];

const gospelRoute: GospelStation[] = [
  {
    id: 1,
    titleTh: "1. การทรงสร้าง",
    titleKr: "1. 창조",
    descTh: "พระเจ้าทรงสร้างจักรวาล มนุษย์ และทุกสิ่งอย่างงดงาม",
    descKr: "하나님께서 세상과 인간을 아름답게 창조하셨습니다.",
    verseTh: "ปฐมกาล 1:1",
    verseKr: "창세기 1:1",
    verseTextTh: "ในปฐมกาล พระเจ้าทรงเนรมิตสร้างฟ้าและแผ่นดิน",
    verseTextKr: "태초에 하나님이 천지를 창조하시니라"
  },
  {
    id: 2,
    titleTh: "2. ความบาป",
    titleKr: "2. 죄",
    descTh: "มนุษย์ละทิ้งพระเจ้าและตกอยู่ในความบาป",
    descKr: "인간이 하나님을 떠นา 죄에 빠졌습니다.",
    verseTh: "โรม 3:23",
    verseKr: "โรมาสาร 3:23",
    verseTextTh: "เพราะว่าทุกคนทำบาป และเสื่อมจากพระเกียรติยศของพระเจ้า",
    verseTextKr: "모든 사람이 죄를 범하였으매 하나님의 영광에 이르지 못하더니"
  },
  {
    id: 3,
    titleTh: "3. ผลของความบาปคือความตาย",
    titleKr: "3. 죄의 결과 죽음",
    descTh: "ค่าตอบแทนของความบาปคือความตายและการสูญสิ้น",
    descKr: "죄의 대가는 영원한 죽음과 절망입니다.",
    verseTh: "โรม 6:23",
    verseKr: "โรมาสาร 6:23",
    verseTextTh: "เพราะว่าค่าตอบแทนที่ได้มาจากความบาปคือความตาย แต่ของขวัญจากพระเจ้าคือชีวิตนิรันดร์ในพระเยซูคริสต์องค์พระผู้เป็นเจ้าของเรา",
    verseTextKr: "죄의 삯은 사망이요 하나님의 은사는 그리스도 예수 우리 주 안에 있는 영생이니라"
  },
  {
    id: 4,
    titleTh: "4. พระผู้ช่วยให้รอด (พระเยซู)",
    titleKr: "4. 구원자 (예수님)",
    descTh: "พระเจ้าทรงส่งพระเยซูคริสต์มาเป็นพระผู้ช่วยให้รอด",
    descKr: "하나님께서 예수 그리스도를 구원자로 보내셨습니다.",
    verseTh: "ยอห์น 3:16",
    verseKr: "โยฮัน 3:16",
    verseTextTh: "เพราะว่าพระเจ้าทรงรักโลกจนได้ทรงประทานพระบุตรองค์เดียวของพระองค์ เพื่อทุกคนที่วางใจในพระบุตรนั้นจะไม่พินาศ แต่มีชีวิตนิรันดร์",
    verseTextKr: "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라"
  },
  {
    id: 5,
    titleTh: "5. ทรงสิ้นพระชนม์แทนเรา",
    titleKr: "5. 대신 죽으심",
    descTh: "พระเยซูทรงแบกรับความบาปและสิ้นพระชนม์บนไม้กางเขนเพื่อเรา",
    descKr: "예수님이 우리 죄를 위해 십자가에서 대신 죽으셨습니다.",
    verseTh: "โรม 5:8",
    verseKr: "โรมาสาร 5:8",
    verseTextTh: "แต่พระเจ้าทรงสำแดงความรักของพระองค์แก่เราทั้งหลาย คือขณะที่เรายังเป็นคนบาปอยู่นั้น พระคริสต์ได้สิ้นพระชนม์เพื่อเรา",
    verseTextKr: "우리가 아직 죄인 되었을 때에 그리스도께서 우리를 위하여 죽으심으로 하나님께서 우리에 대한 자기의 사랑을 확증하셨느니라"
  },
  {
    id: 6,
    titleTh: "6. การช่วยให้รอด",
    titleKr: "6. 구원",
    descTh: "เราได้รับการอภัยบาปและได้รับชีวิตนิรันดร์เป็นของขวัญ",
    descKr: "죄 사함을 받고 영원한 생명을 선물로 받습니다.",
    verseTh: "เอเฟซัส 2:8",
    verseKr: "เอเบซัส 2:8",
    verseTextTh: "เพราะว่าท่านทั้งหลายได้รับความรอดโดยพระคุณผ่านทางความเชื่อ และความรอดนี้ไม่ได้มาจากตัวท่านเอง แต่เป็นของขวัญจากพระเจ้า",
    verseTextKr: "너희는 그 은혜에 의하여 믿음으로 말미암아 구원을 받았으니 이것은 너희에게서 난 것이 아니요 하나님의 선물이라"
  },
  {
    id: 7,
    titleTh: "7. ความเชื่อ",
    titleKr: "7. 믿음",
    descTh: "รับการช่วยให้รอดได้โดยการเชื่อและต้อนรับพระเยซูด้วยหัวใจ",
    descKr: "예수님을 마음으로 믿고 영접함으로 구원에 이릅니다.",
    verseTh: "โรม 10:10",
    verseKr: "โรมาสาร 10:10",
    verseTextTh: "เพราะว่าการเชื่อด้วยใจนำไปสู่ความชอบธรรม และการยอมรับด้วยปากนำไปสู่ความรอด",
    verseTextKr: "사람이 마음으로 믿어 의에 이르이고 입으로 시인하여 구원에 이르느นิ라"
  },
  {
    id: 8,
    titleTh: "8. พระคริสต์จะเสด็จกลับมาอีกครั้ง",
    titleKr: "8. 다시 오실 그리스도",
    descTh: "พระเยซูจะเสด็จกลับมาอีกครั้งเพื่อประทานความหวังและอาณาจักรนิรันดร์",
    descKr: "예수님이 다시 오셔서 영원한 하나님 나라를 완성하십니다.",
    verseTh: "วิวรณ์ 22:20",
    verseKr: "โยฮันเคชิรก 22:20",
    verseTextTh: "พระองค์ผู้ทรงเป็นพยานในสิ่งเหล่านี้ตรัสว่า \"เราจะมาในเร็วๆ นี้อย่างแน่นอน\" อาเมน พระเยซูองค์พระผู้เป็นเจ้า ขอเชิญเสด็จมาเถิด",
    verseTextKr: "이것들을 증언하신 이가 이르시되 내가 진실로 속히 오리라 하시거늘 아멘 주 예수여 오시옵소서"
  }
];

const bibleVerses: BibleVerse[] = [
  { th: "เพราะว่าพระเจ้าทรงรักโลกจนได้ทรงประทานพระบุตรองค์เดียวของพระองค์", kr: "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니", refTh: "(ยอห์น 3:16)", refKr: "(요 3:16)" },
  { th: "พระยาห์เวห์ทรงเป็นผู้เลี้ยงดูข้าพเจ้า ข้าพเจ้าจะไม่ขัดสน", kr: "여호와는 나의 목자시니 내게 부족함이 없으리로다", refTh: "(สดุดี 23:1)", refKr: "(시 23:1)" },
  { th: "บรรดาผู้เหน็ดเหนื่อยและแบกภาระหนัก จงมาหาเรา และเราจะให้ท่านทั้งหลายหายเหนื่อยเป็นสุข", kr: "수고하고 짐 진 자들아 다 내게로 오라 내가 너희를 쉬게 하리라", refTh: "(แมทธิว 11:28)", refKr: "(마 11:28)" }
];

// 울산 태국 노동자를 위한 필수 웹사이트 10선 데이터 전체
const usefulLinks: UsefulLink[] = [
  {
    nameTh: "ระบบ HiKorea (ไฮโคเรีย)",
    nameKr: "하이코เรีย (출입국 민원)",
    descTh: "จองคิว จองเวลา และต่ออายุวีซ่า/เปลี่ยนที่อยู่",
    descKr: "비자 연장, 주소지 변경, 출입국 방문 예약",
    url: "https://www.hikorea.go.kr",
    category: "วีซ่า / Visa"
  },
  {
    nameTh: "ระบบ EPS (การจ้างงาน)",
    nameKr: "EPS 외국인고용",
    descTh: "ตรวจสอบสัญญาจ้าง สิทธิ และย้ายงาน",
    descKr: "근로계약서, 체류기간 및 이직 내역 조회",
    url: "https://www.eps.go.kr",
    category: "แรงงาน / Labour"
  },
  {
    nameTh: "ศูนย์ช่วยเหลือแรงงานต่างชาติอุลซาน",
    nameKr: "울산외국인주민지원센터",
    descTh: "คำปรึกษาด้านกฎหมาย แรงงาน และการใช้ชีวิตในอุลซาน",
    descKr: "울산 거주 외국인 노무·법률·생활 상담",
    url: "http://www.ulsanfic.org",
    category: "สนับสนุน / Support"
  },
  {
    nameTh: "สถานเอกอัครราชทูตไทย ณ กรุงโซล",
    nameKr: "주한 태국대사관",
    descTh: "หนังสือเดินทาง เอกสารราชการ และความช่วยเหลือคนไทย",
    descKr: "여권 재발급, 공증, 태국 국민 긴급 지원",
    url: "https://seoul.thaiembassy.org",
    category: "สถานทูต / Embassy"
  },
  {
    nameTh: "สายด่วนกระทรวงแรงงาน (1350)",
    nameKr: "고용노동부 상담센터 (1350)",
    descTh: "ปรึกษาปัญหาค่าจ้าง การทำงาน และการละเมิดสิทธิ (มีล่าม)",
    descKr: "임금 체불, 노동권 침해 상담 (통역 제공)",
    url: "https://www.moel.go.kr",
    category: "แรงงาน / Labour"
  },
  {
    nameTh: "ศูนย์บริการช่วยเหลือต่างชาติ (1345)",
    nameKr: "외국인 종합안내센터 (1345)",
    descTh: "ศูนย์บริการข้อมูลวีซ่าและการใช้ชีวิตแบบมัลติภาษา",
    descKr: "출입국·체류 안내 및 다어 통역 서비스",
    url: "https://www.immigration.go.kr",
    category: "วีซ่า / Visa"
  },
  {
    nameTh: "สำนักงานประกันสุขภาพแห่งชาติ (NHIS)",
    nameKr: "국민건강보험공단",
    descTh: "ตรวจสอบสิทธิการรักษาพยาบาลและค่าประกันสุขภาพ",
    descKr: "외국인 건강보험 자격 조회 및 자격 관리",
    url: "https://www.nhis.or.kr",
    category: "การแพทย์ / Medical"
  },
  {
    nameTh: "สถาบันพัฒนาทรัพยากรมนุษย์แห่งเกาหลี (HRD Korea)",
    nameKr: "한국산업인력공단",
    descTh: "อบรมทักษะงาน สอบวัดระดับ และสนับสนุนการทำงาน",
    descKr: "외국인력 재ก귀환 지원 및 직무 교육",
    url: "https://www.hrdkorea.or.kr",
    category: "การศึกษา / Training"
  },
  {
    nameTh: "ระบบขนส่งมวลชนเมืองอุลซาน",
    nameKr: "울산버스정보앱 (Ulsan Bus)",
    descTh: "เส้นทางรถประจำทางและเวลาวิ่งในเมืองอุลซาน",
    descKr: "울산 시내버스 실시간 운행 정보 및 노선 안내",
    url: "https://its.ulsan.go.kr",
    category: "การเดินทาง / Transport"
  },
  {
    nameTh: "ศูนย์สายด่วนเจ็บป่วยฉุกเฉิน (119 / Danuri 1577-1366)",
    nameKr: "다누리 콜센터 (1577-1366)",
    descTh: "สายด่วนช่วยเหลือฉุกเฉินและการปรับตัวในเกาหลี 24 ชม.",
    descKr: "외국인 긴급 지원 및 24시간 다문화 상담",
    url: "https://www.liveinkorea.kr",
    category: "ฉุกเฉิน / Emergency"
  }
];

export const App: React.FC = () => {
  const [isKorean, setIsKorean] = useState<boolean>(false);
  const [todayVerse, setTodayVerse] = useState<BibleVerse | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'electric' | 'korean'>('home');

  // 전기세 분배 계산기 State
  const [totalBill, setTotalBill] = useState<number>(0);
  const [rooms, setRooms] = useState<RoomBill[]>([
    { id: 1, name: 'ห้อง 1 (방 1)', usage: 0, cost: 0 },
    { id: 2, name: 'ห้อง 2 (방 2)', usage: 0, cost: 0 }
  ]);

  // 한국어 배우기 랜덤 7개 추출 State
  const [randomKoreanList, setRandomKoreanList] = useState<KoreanStudyItem[]>([]);

  const getRandomStudyItems = () => {
    const shuffled = [...koreanStudyDatabase].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 7);
  };

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * bibleVerses.length);
    setTodayVerse(bibleVerses[randomIndex]);

    setRandomKoreanList(getRandomStudyItems());
  }, []);

  const handleRefreshKoreanList = () => {
    setRandomKoreanList(getRandomStudyItems());
  };

  const toggleLanguage = () => {
    setIsKorean(prev => !prev);
  };

  // 전기세 계산 함수
  const calculateBillDistribution = (updatedTotalBill: number, updatedRooms: RoomBill[]) => {
    const totalUsage = updatedRooms.reduce((acc, room) => acc + (room.usage || 0), 0);

    if (updatedTotalBill <= 0 || totalUsage <= 0) {
      setRooms(updatedRooms.map(r => ({ ...r, cost: 0 })));
      return;
    }

    let calculatedRooms = updatedRooms.map(room => {
      const ratio = (room.usage || 0) / totalUsage;
      const exactCost = updatedTotalBill * ratio;
      const roundedCost = Math.round(exactCost / 100) * 100;
      return { ...room, cost: roundedCost };
    });

    const currentTotalCost = calculatedRooms.reduce((acc, r) => acc + r.cost, 0);
    const difference = updatedTotalBill - currentTotalCost;

    if (difference !== 0) {
      const activeRooms = calculatedRooms.filter(r => r.usage > 0);
      if (activeRooms.length > 0) {
        const minUsage = Math.min(...activeRooms.map(r => r.usage));
        const minRoomIndex = calculatedRooms.findIndex(r => r.usage === minUsage);

        if (minRoomIndex !== -1) {
          calculatedRooms[minRoomIndex].cost += difference;
        }
      }
    }

    setRooms(calculatedRooms);
  };

  const handleTotalBillChange = (val: number) => {
    setTotalBill(val);
    calculateBillDistribution(val, rooms);
  };

  const handleAddRoom = () => {
    const newRoom: RoomBill = {
      id: Date.now(),
      name: isKorean ? `방 ${rooms.length + 1}` : `ห้อง ${rooms.length + 1}`,
      usage: 0,
      cost: 0
    };
    const updatedRooms = [...rooms, newRoom];
    calculateBillDistribution(totalBill, updatedRooms);
  };

  const handleRemoveRoom = (id: number) => {
    if (rooms.length <= 1) return;
    const updatedRooms = rooms.filter(r => r.id !== id);
    calculateBillDistribution(totalBill, updatedRooms);
  };

  const handleRoomNameChange = (id: number, name: string) => {
    const updatedRooms = rooms.map(r => r.id === id ? { ...r, name } : r);
    setRooms(updatedRooms);
  };

  const handleRoomUsageChange = (id: number, usage: number) => {
    const updatedRooms = rooms.map(r => r.id === id ? { ...r, usage } : r);
    calculateBillDistribution(totalBill, updatedRooms);
  };

  const totalUsage = rooms.reduce((acc, r) => acc + (r.usage || 0), 0);

  return (
    <div className="app-container">
      {/* 상단 내비게이션 */}
      <header className="header">
        <div className="logo" onClick={() => setActiveTab('home')} style={{ cursor: 'pointer' }}>
          <h1>ย้ายไทย <span>(moving Thai)</span></h1>
        </div>
        <button className="lang-toggle-btn" onClick={toggleLanguage}>
          {isKorean ? "🇹🇭 ภาษาไทย" : "🇰🇷 한국어 번역"}
        </button>
      </header>

      {/* 메인 서비스 메뉴 버튼 */}
      <nav className="nav-menu">
        <button 
          className={`nav-btn ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          {isKorean ? "🏠 홈" : "🏠 หน้าหลัก"}
        </button>
        <button 
          className={`nav-btn ${activeTab === 'electric' ? 'active' : ''}`}
          onClick={() => setActiveTab('electric')}
        >
          {isKorean ? "⚡ 전기세 계산" : "⚡ คำนวณค่าไฟฟ้า"}
        </button>
        <button 
          className={`nav-btn ${activeTab === 'korean' ? 'active' : ''}`}
          onClick={() => setActiveTab('korean')}
        >
          {isKorean ? "📖 한국어 배우기" : "📖 เรียนภาษาเกาหลี"}
        </button>
      </nav>

      {/* 탭 1: 메인 홈 화면 */}
      {activeTab === 'home' && (
        <main className="main-content">
          <section className="hero-section">
            <div className="hero-image-wrapper">
              <img src={pic1} alt="Community 1" className="hero-img main-img" />
              <img src={pic2} alt="Community 2" className="hero-img sub-img" />
            </div>
            <div className="hero-text">
              <h2>{isKorean ? "예수님 믿으세요." : "จงเชื่อในพระเยซู"}</h2>
              <h4>{isKorean ? "우리는 예수님을 믿어야 천국에 갈 수 있습니다." : "เราต้องเชื่อในพระเยซูจึงจะไปสวรรค์ได้"}</h4>
              <p>
                {isKorean 
                  ? "예수께서 이르시되 내가 곧 길이요 진리요 생명이니 나로 말미암지 않고는 아버지께로 올 자가 없느니라.(요 14:6)" 
                  : "พระเยซูตรัสกับเขาว่า เราเป็นทางนั้น เป็นความจริง และเป็นชีวิต ไม่มีใครมาถึงพระบิดาได้นอกจากมาทางเรา (ยอห์น 14:6)"}
              </p>
            </div>
          </section>

          <section className="verse-card">
            <span className="verse-badge">{isKorean ? "오늘의 말씀" : "ข้อพระธรรมวันนี้"}</span>
            {todayVerse && (
              <div className="verse-body">
                <p className="verse-text">"{isKorean ? todayVerse.kr : todayVerse.th}"</p>
                <p className="verse-ref">{isKorean ? todayVerse.refKr : todayVerse.refTh}</p>
              </div>
            )}
          </section>

          <section className="subway-section">
            <div className="subway-header">
              <span className="metro-badge">LINE 1: JESUS CHRIST</span>
              <h3>
                {isKorean 
                  ? "🚇 구원의 길: 복음 지하철 노선도" 
                  : "🚇 เส้นทางแห่งการช่วยให้รอด: แผนที่รถไฟใต้ดินแห่งข่าวประเสริฐ"}
              </h3>
              <p className="subway-subtitle">
                {isKorean 
                  ? "창조부터 다시 오실 예수님까지 이어지는 8개의 노선 역입니다." 
                  : "8 สถานีเชื่อมโยงตั้งแต่การทรงสร้างจนถึงการเสด็จกลับมาของพระเยซู"}
              </p>
            </div>

            <div className="subway-map-container">
              <div className="subway-line"></div>
              <div className="subway-stations">
                {gospelRoute.map((station) => (
                  <div key={station.id} className="subway-station-item">
                    <div className="station-node-wrapper">
                      <div className="station-node">
                        <span className="node-number">{station.id}</span>
                      </div>
                    </div>
                    <div className="station-info-card">
                      <div className="station-header">
                        <h4>{isKorean ? station.titleKr : station.titleTh}</h4>
                        <span className="station-verse">{isKorean ? station.verseKr : station.verseTh}</span>
                      </div>
                      <p className="station-desc">{isKorean ? station.descKr : station.descTh}</p>
                      <blockquote className="station-verse-text">
                        "{isKorean ? station.verseTextKr : station.verseTextTh}"
                      </blockquote>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="links-section">
            <div className="section-title">
              <h3>
                {isKorean 
                  ? "🔗 울산 태국 노동자를 위한 필수 웹사이트 10선" 
                  : "🔗 10 เว็บไซต์ที่จำเป็นสำหรับแรงงานไทยในอุลซาน"}
              </h3>
            </div>
            <div className="links-grid">
              {usefulLinks.map((item, idx) => (
                <a key={idx} href={item.url} target="_blank" rel="noopener noreferrer" className="link-card">
                  <div className="link-category">{item.category}</div>
                  <h4>{isKorean ? item.nameKr : item.nameTh}</h4>
                  <p>{isKorean ? item.descKr : item.descTh}</p>
                  <div className="link-action">
                    <span>{isKorean ? "방문하기 ➔" : "ไปยังเว็บไซต์ ➔"}</span>
                  </div>
                </a>
              ))}
            </div>
          </section>

          <section className="gallery-section">
            <div className="gallery-card">
              <img src={pic3} alt="Community 3" />
              <div className="gallery-desc">
                <h4>{isKorean ? "예배하는 사람들" : "ผู้บูชา"}</h4>
                <p>
                  {isKorean 
                    ? "저희는 매주 일요일 오직 하나님을 예배하는 공동체입니다." 
                    : "เราเป็นชุมชนที่นมัสการพระเจ้าแต่เพียงผู้เดียวทุกวันอาทิตย์"}
                </p>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* 탭 2: 전기세 분배 계산기 페이지 */}
      {activeTab === 'electric' && (
        <main className="main-content">
          <section className="page-card">
            <h3>{isKorean ? "⚡ 방별 전기요금 계산기" : "⚡ เครื่องคำนวณค่าไฟฟ้าแยกตามห้อง"}</h3>
            <p className="page-desc">
              {isKorean 
                ? "전체 요금과 방별 전기 사용량을 입력하면 쓴 만큼 요금을 나눠드립니다." 
                : "กรอกค่าไฟทั้งหมดและปริมาณการใช้ไฟฟ้าของแต่ละห้อง เพื่อคำนวณค่าไฟตามจริงที่ใช้"}
            </p>

            <div className="calc-container">
              <div className="total-bill-input-group">
                <label htmlFor="total-bill-input">
                  {isKorean ? "총 전기 요금 (원):" : "ค่าไฟฟ้าทั้งหมด (วอน):"}
                </label>
                <input 
                  id="total-bill-input"
                  type="number" 
                  placeholder={isKorean ? "예: 150000" : "ตัวอย่าง: 150000"} 
                  value={totalBill || ''} 
                  onChange={(e) => handleTotalBillChange(Number(e.target.value))}
                />
              </div>

              <div className="room-list">
                <div className="room-list-header">
                  <span>{isKorean ? "방 목록" : "รายการห้อง"}</span>
                  <button className="add-room-btn" onClick={handleAddRoom}>
                    {isKorean ? "+ 방 추가" : "+ เพิ่มห้อง"}
                  </button>
                </div>

                {rooms.map((room) => (
                  <div key={room.id} className="room-item">
                    <input 
                      type="text" 
                      className="room-name-input"
                      value={room.name}
                      onChange={(e) => handleRoomNameChange(room.id, e.target.value)}
                      placeholder={isKorean ? "방 이름" : "ชื่อห้อง"}
                    />
                    <div className="usage-input-wrapper">
                      <input 
                        type="number" 
                        className="room-usage-input"
                        value={room.usage || ''}
                        onChange={(e) => handleRoomUsageChange(room.id, Number(e.target.value))}
                        placeholder={isKorean ? "사용량 (kWh)" : "หน่วยที่ใช้ (kWh)"}
                      />
                      <span className="unit-text">kWh</span>
                    </div>

                    <div className="room-cost-display">
                      <span className="cost-amount">{room.cost.toLocaleString()}</span>
                      <span className="cost-unit">{isKorean ? "원" : "วอน"}</span>
                    </div>

                    {rooms.length > 1 && (
                      <button 
                        className="delete-room-btn" 
                        onClick={() => handleRemoveRoom(room.id)}
                        title={isKorean ? "삭제" : "ลบ"}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="calc-summary">
                <div className="summary-row">
                  <span>{isKorean ? "총 사용량:" : "หน่วยที่ใช้รวม:"}</span>
                  <strong>{totalUsage.toLocaleString()} kWh</strong>
                </div>
                <div className="summary-row highlight">
                  <span>{isKorean ? "계산된 요금 합계:" : "รวมค่าไฟฟ้าที่คำนวณ:"}</span>
                  <strong>{rooms.reduce((acc, r) => acc + r.cost, 0).toLocaleString()} {isKorean ? "원" : "วอน"}</strong>
                </div>
                {totalBill > 0 && totalBill !== rooms.reduce((acc, r) => acc + r.cost, 0) && (
                  <p className="notice-text">
                    {isKorean 
                      ? "* 10원 단위 잔돈은 사용량이 가장 적은 방 요금에 포함되었습니다." 
                      : "* ปเศษส่วนต่างจะถูกคำนวณปัดเศษและปรับเข้ากับห้องที่ใช้น้อยที่สุด"}
                  </p>
                )}
              </div>
            </div>
          </section>
        </main>
      )}

      {/* 탭 3: 한국어 공부 페이지 */}
      {activeTab === 'korean' && (
        <main className="main-content">
          <section className="page-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3>{isKorean ? "📖 한국어 학습 (7개 추천)" : "📖 เรียนภาษาเกาหลี (7 ประโยค)"}</h3>
              <button className="add-room-btn" onClick={handleRefreshKoreanList}>
                {isKorean ? "🔄 새로고침" : "🔄 สุ่มใหม่"}
              </button>
            </div>
            <p className="page-desc">
              {isKorean 
                ? "40개의 한국어 표현 중에서 랜덤으로 추천된 7개의 단어/문장입니다." 
                : "7 คำศัพท์และประโยคภาษาเกาหลีที่สุ่มเลือกมาจาก 40 รายการ"}
            </p>
            
            <div className="korean-grid">
              {randomKoreanList.map((item, idx) => (
                <div key={item.id} className="study-card">
                  <div style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 'bold', marginBottom: '4px' }}>
                    #{idx + 1}
                  </div>
                  <h4>{item.kr}</h4>
                  <p>คำอ่าน (발음): {item.thPron}</p>
                  <p>ความหมาย (ความหมาย): {item.thMeaning}</p>
                  <span style={{ fontSize: '0.75rem', color: '#888' }}>({item.enMeaning})</span>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}

      {/* 푸터 */}
      <footer className="footer">
        <p>© 2026 moving Thai (ย้ายไทย) Christian Community in Ulsan. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;