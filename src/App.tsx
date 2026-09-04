import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './App.css';

// Firebase Database 함수 임포트
import { db } from './firebase';
import { ref, onValue, push, update, remove } from 'firebase/database';

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

// 커뮤니티 댓글 및 게시글 타입 정의
interface CommentItem {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

interface PostItem {
  id: string;
  author: string;
  content: string;
  likes: number;
  createdAt: string;
  comments?: Record<string, CommentItem>;
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

// 8단계 복음 노선도 역(Station) 데이터
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
    descKr: "인간이 하나님을 떠나 죄에 빠졌습니다.",
    verseTh: "โรม 3:23",
    verseKr: "로มา서 3:23",
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
    verseKr: "โรมา서 6:23",
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
    verseKr: "요한복음 3:16",
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
    verseKr: "โรมา서 5:8",
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
    verseKr: "에베소서 2:8",
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
    verseKr: "โรมา서 10:10",
    verseTextTh: "เพราะว่าการเชื่อด้วยใจนำไปสู่ความชอบธรรม และการยอมรับด้วยปากนำไปสู่ความรอด",
    verseTextKr: "사람이 마음으로 믿어 의에 이르이고 입으로 시인하여 구원에 이르느니라"
  },
  {
    id: 8,
    titleTh: "8. พระคริสต์จะเสด็จกลับมาอีกครั้ง",
    titleKr: "8. 다시 오실 그리스도",
    descTh: "พระเยซูจะเสด็จกลับมาอีกครั้งเพื่อประทานความหวังและอาณาจักรนิรันดร์",
    descKr: "예수님이 다시 오셔서 영원한 하나님 나라를 완성하십니다.",
    verseTh: "วิวรณ์ 22:20",
    verseKr: "요한계시록 22:20",
    verseTextTh: "พระองค์ผู้ทรงเป็นพยานในสิ่งเหล่านี้ตรัสว่า \"เราจะมาในเร็วๆ นี้อย่างแน่นอน\" อาเมน พระเยซูองค์พระผู้เป็นเจ้า ขอเชิญเสด็จมาเถิด",
    verseTextKr: "이것들을 증언하신 이가 이르시되 내가 진실로 속히 오리라 하시거늘 아멘 주 예수여 오시옵소서"
  }
];

const bibleVerses: BibleVerse[] = [
  { th: "เพราะว่าพระเจ้าทรงรักโลกจนได้ทรงประทานพระบุตรองค์เดียวของพระองค์", kr: "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니", refTh: "(ยอห์น 3:16)", refKr: "(요 3:16)" },
  { th: "พระยาห์เวห์ทรงเป็นผู้เลี้ยงดูข้าพเจ้า ข้าพเจ้าจะไม่ขัดสน", kr: "여호와는 나의 목자시니 내게 부족함이 없으리로다", refTh: "(สดุดี 23:1)", refKr: "(시 23:1)" },
  { th: "บรรดาผู้เหน็ดเหนื่อยและแบกภาระหนัก จงมาหาเรา และเราจะให้ท่านทั้งหลายหายเหนื่อยเป็นสุข", kr: "수고하고 짐 진 자들아 다 내게로 오라 내가 너희를 쉬게 하리라", refTh: "(แมทธิว 11:28)", refKr: "(마 11:28)" },
  { th: "จงวางใจในพระยาห์เวห์ด้วยสุดใจของเจ้า และอย่าพึ่งพาความเข้าใจของตนเอง", kr: "너는 마음을 다하여 여호와를 신뢰하고 네 명철을 의지하지 말라", refTh: "(สุภาษิต 3:5)", refKr: "(잠 3:5)" },
  { th: "จงยอมรับพระองค์ในทุกทางของเจ้า แล้วพระองค์จะทรงชี้ทางเดินของเจ้าให้ตรง", kr: "너는 범사에 그를 인정하라 그리하면 네 길을 지도하시รี라", refTh: "(สุภาษิต 3:6)", refKr: "(잠 3:6)" },
  { th: "อย่ากลัวเลย เพราะเราอยู่กับเจ้า อย่าหวาดหวั่น เพราะเราเป็นพระเจ้าของเจ้า เราจะเสริมกำลังเจ้า เราจะช่วยเจ้า", kr: "두려워하지 말라 내가 너와 함께 함이라 놀라지 말라 나는 네 하나님이 됨이라 내가 너를 굳세게 하리라 참으로 너를 도와 주리라", refTh: "(อิสยาห์ 41:10)", refKr: "(사 41:10)" },
  { th: "ข้าพเจ้าเผชิญทุกสิ่งได้โดยพระองค์ผู้ทรงเสริมกำลังข้าพเจ้า", kr: "내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라", refTh: "(ฟีลิปปี 4:13)", refKr: "(빌 4:13)" },
  { th: "และพระเจ้าของข้าพเจ้าจะทรงจัดหาทุกสิ่งที่จำเป็นให้แก่ท่านทั้งหลายจากความมั่งคั่งอันทรงเกียรติในพระเยซูคริสต์", kr: "나의 하나님이 그리스도 예수 안에서 영광 가운데 그 풍성한 대로 너희 모든 쓸 것을 채우시리라", refTh: "(ฟีลิปปี 4:19)", refKr: "(빌 4:19)" },
  { th: "อย่าวิตกกังวลในสิ่งใดๆ เลย แต่จงทูลขอทุกสิ่งต่อพระเจ้าด้วยการอธิษฐานและการวิงวอน พร้อมกับการขอบพระคุณ", kr: "아무 것도 염려하지 말고 다만 모든 일에 기도와 간구로, 너희 구할 것을 감사함으로 하나님께 아뢰라", refTh: "(ฟีลิปปี 4:6)", refKr: "(빌 4:6)" },
  { th: "แล้วสันติสุขของพระเจ้าที่เกินความเข้าใจจะคุ้มครองจิตใจและความคิดของท่านไว้ในพระเยซูคริสต์", kr: "그리하면 모든 지각에 뛰어난 하나님의 평강이 그리스도 예수 안에서 너희 마음과 생각을 지키시리라", refTh: "(ฟีลิปปี 4:7)", refKr: "(빌 4:7)" },
  { th: "ถ้าอย่างนั้น เราจะว่าอย่างไรเกี่ยวกับสิ่งเหล่านี้? ถ้าพระเจ้าทรงอยู่ฝ่ายเรา ใครจะขัดขวางเราได้?", kr: "그런즉 이 일에 대하여 우리가 무슨 말 하리요 만일 하나님이 우리를 위하시면 누가 우리를 대적하리요", refTh: "(โรม 8:31)", refKr: "(롬 8:31)" },
  { th: "เหตุฉะนั้น ถ้าใครอยู่ในพระคริสต์ เขาก็เป็นคนที่ถูกสร้างใหม่แล้ว สิ่งสารพัดที่เก่าๆ ก็ล่วงไป นี่ยังไงล่ะ สิ่งใหม่ก็เกิดขึ้นมาแล้ว", kr: "그런즉 누구든지 그리스도 안에 있으면 새로운 피조물이라 이전 것은 지나갔으니 보라 새 것이 되었도다", refTh: "(2 โครินธ์ 5:17)", refKr: "(고후 5:17)" },
  { th: "เพราะว่าท่านทั้งหลายได้รับความรอดโดยนึกถึงพระคุณผ่านทางความเชื่อ และสิ่งนี้ไม่ได้มาจากตัวท่านเอง แต่เป็นของประทานจากพระเจ้า", kr: "너희는 그 은혜에 의하여 믿음으로 말미암아 구원을 받았으니 이것은 너희에게서 난 것이 아니요 하나님의 선물이라", refTh: "(เอเฟซัส 2:8)", refKr: "(엡 2:8)" },
  { th: "พระวจนะของพระองค์เป็นตะเกียงแก่เท้าของข้าพระองค์ และเป็นแสงสว่างแก่ทางของข้าพระองค์", kr: "주의 말씀은 내 발에 등요 내 길에 빛이니이다", refTh: "(สดุดี 119:105)", refKr: "(시 119:105)" },
  { th: "จงแสวงหาแผ่นดินของพระเจ้าและความชอบธรรมของพระองค์ก่อน แล้วพระองค์จะทรงเพิ่มเติมสิ่งทั้งปวงนี้ให้", kr: "그런즉 너희는 먼저 그의 나라와 그의 의를 구하라 그리하면 이 모든 것을 너희에게 더하시리라", refTh: "(แมทธิว 6:33)", refKr: "(마 6:33)" },
  { th: "เรามอบสันติสุขไว้กับพวกท่าน สันติสุขของเราที่ให้แก่ท่านนั้น เราไม่ได้ให้อย่างที่โลกให้ อย่าให้ใจของท่านวิตกกังวลและอย่ากลัวเลย", kr: "평안을 너희에게 미치노니 곧 나의 평안을 너희에게 주노라 내가 너희에게 주는 것은 세상이 주는 것과 같지 아니하니라 너희는 마음에 근심하지도 말고 두려워하지도 말라", refTh: "(ยอห์น 14:27)", refKr: "(요 14:27)" },
  { th: "เราเป็นทางนั้น เป็นความจริง และเป็นชีวิต ไม่มีใครมาถึงพระบิดาได้เว้นแต่มาทางเรา", kr: "내가 곧 길요 진리요 생명이니 나로 말미암지 않고는 아버지께로 올 자가 없느니라", refTh: "(ยอห์น 14:6)", refKr: "(요 14:6)" },
  { th: "ความรักนั้นก็อดทนนานและแสดงความปรานี ความรักไม่อิจฉา ไม่อวดตัว ไม่จองหอง", kr: "사랑은 오래 참고 사랑은 온유하며 시기하지 아니하며 사랑은 자랑하지 아니하며 교만하지 아니하며", refTh: "(1 โครินธ์ 13:4)", refKr: "(고전 13:4)" },
  { th: "ดังนั้นยังคงอยู่สามสิ่งนี้ คือความเชื่อ ความหวัง และความรัก แต่ความรักใหญ่ที่สุด", kr: "그런즉 믿음, 소망, 사랑, 이 세 가지는 항상 있을 것인데 그 중의 제일은 사랑이라", refTh: "(고린ธ์ 13:13)", refKr: "(고전 13:13)" },
  { th: "พระยาห์เวห์ทรงเป็นกำลังและเป็นโล่ของข้าพเจ้า จิตใจของข้าพเจ้าวางใจในพระองค์ ข้าพเจ้าจึงได้รับการช่วยกู้", kr: "여호와는 나의 힘과 나의 방패이시니 내 마음이 그를 의지하여 도움을 얻었도다", refTh: "(สดุดี 28:7)", refKr: "(시 28:7)" },
  { th: "พระยาห์เวห์ทรงสถิตใกล้ผู้ที่แตกสลาย และทรงช่วยผู้ที่บอบช้ำทางจิตใจ", kr: "여호와는 마음이 상한 자를 가까이 하시고 충심으로 통회하는 자를 구원하시는도다", refTh: "(สดุดี 34:18)", refKr: "(시 34:18)" },
  { th: "แต่บรรดาผู้ที่รอคอยพระยาห์เวห์จะได้รับกำลังใหม่ เขาจะบินขึ้นด้วยพลังเหมือนนกอินทรี", kr: "오직 여호와를 바라는 자는 새 힘을 얻으리니 독수리가 날개치며 올라감 같을 것이요", refTh: "(อิสยาห์ 40:31)", refKr: "(사 40:31)" },
  { th: "จงชื่นชมยินดีอยู่เสมอ", kr: "항상 기뻐하라", refTh: "(1 เทสซาโลนิการ์ 5:16)", refKr: "(살전 5:16)" },
  { th: "จงอธิษฐานอย่างสม่ำเสมอ", kr: "쉬지 말고 기도하라", refTh: "(1 เทสซาโลนิการ์ 5:17)", refKr: "(살전 5:17)" },
  { th: "จงขอบพระคุณในทุกกรณี เพราะนี่แหละเป็นพระประสงค์ของพระเจ้าสำหรับพวกท่านในพระเยซูคริสต์", kr: "범사에 감사하라 이것이 그리스도 예수 안에서 너희를 향하신 하나님의 뜻이니라", refTh: "(1 เทสซาโลนิการ์ 5:18)", refKr: "(살전 5:18)" },
  { th: "จงมีความเข้มแข็งและกล้าหาญเถิด อย่ากลัวหรือครั่นคร้ามเลย เพราะว่าพระยาห์เวห์พระเจ้าของเจ้าทรงสถิตอยู่กับเจ้า", kr: "강하고 담대하라 두려워하지 말라 그들 앞에서 떨지 말라 이는 네 하나님 여호와 그가 너와 함께 가시며", refTh: "(เฉลยธรรมบัญญัติ 31:6)", refKr: "(신 31:6)" },
  { th: "จงมอบทางของท่านไว้กับพระยาห์เวห์ จงวางใจในพระองค์ และพระองค์จะทรงช่วยท่าน", kr: "네 길을 여호와께 맡기라 그를 의지하면 그가 이루시고", refTh: "(สดุดี 37:5)", refKr: "(시 37:5)" },
  { th: "จงสงบอยู่ต่อพระยาห์เวห์ และเพียรรอคอยพระองค์", kr: "여호와 앞에 잠잠하고 참아 기다리라", refTh: "(สดุดี 37:7)", refKr: "(시 37:7)" },
  { th: "พระองค์ทรงรักษาคนใจแตกสลาย และทรงพันผูกบาดแผลของเขา", kr: "상심한 자들을 고치시며 그들의 상처를 싸매시는도다", refTh: "(สดุดี 147:3)", refKr: "(시 147:3)" },
  { th: "จงเมตตาต่อกัน จงมีใจปรานี และจงอภัยโทษให้กันเหมือนอย่างที่พระเจ้าทรงอภัยโทษให้พวกท่านในพระคริสต์", kr: "서로 친절하게 하며 불쌍히 여기며 서로 용서하기를 하나님이 그리스도 안에서 너희를 용서하심과 같이 하라", refTh: "(เอเฟซัส 4:32)", refKr: "(엡 4:32)" },
  { th: "จงถอดความวิตกกังวลทั้งสิ้นของท่านออกไปให้พระองค์ เพราะพระองค์ทรงห่วงใยท่านทั้งหลาย", kr: "너희 염려를 다 주께 맡기라 이는 그가 너희를 돌보심이라", refTh: "(1 ปีเตอร์ 5:7)", refKr: "(벧전 5:7)" },
  { th: "เราเป็นเถาองุ่น พวกท่านเป็นกิ่ง ผู้ที่สมรสอยู่กับเราและเราอยู่ในเขา คนนั้นจะออกผลมาก เพราะถ้าแยกจากเราแล้วพวกท่านจะทำสิ่งใดไม่ได้เลย", kr: "나는 포도나무요 너희는 가지라 그가 내 안에, 내가 그 안에 거하면 사람이 열매를 많이 맺나니 나를 떠나서는 너희가 아무 것도 할 수 없음이라", refTh: "(ยอห์น 15:5)", refKr: "(요 15:5)" },
  { th: "จงขอแล้วจะได้ จงแสวงหาแล้วจะพบ จงเคาะแล้วจะเปิดให้แก่ท่าน", kr: "구하라 그리하면 너희에게 주실 것이요 찾으라 그리하면 찾아낼 것이요 문을 두드리라 그리하면 너희에게 열릴 것이니", refTh: "(แมทธิว 7:7)", refKr: "(มธ 7:7)" },
  { th: "ความรักมั่นคงของพระยาห์เวห์ไม่เคยหยุดยั้ง พระกรุณาของพระองค์ไม่เคยสิ้นสุด เป็นของใหม่อยู่ทุกเช้า ความซื่อสัตย์ของพระองค์ใหญ่ยิ่งนัก", kr: "여호와의 인자와 성실이 무궁하시므로 우리가 진멸되지 아니함이니이다 이것들이 아침마다 새로우니 주의 성실하심이 크시도소이다", refTh: "(เพลงคร่ำครวญ 3:22-23)", refKr: "(애 3:22-23)" }
];

// 울산 태국 노동자를 위한 필수 웹사이트 10선 데이터
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
    nameTh: "ศูนย์สนับสนุนแรงงานต่างชาติอุลซาน",
    nameKr: "울산외국인주민지원센터",
    descTh: "รับปรึกษาข้อกฎหมาย ล่ามภาษาไทย และกิจกรรมในอุลซาน",
    descKr: "울산 지역 무료 법률·노무 상담 및 한국어 교육",
    url: "http://usfr.or.kr",
    category: "อุลซาน / Ulsan"
  },
  {
    nameTh: "สถานเอกอัครราชทูตไทย ณ กรุงโซล",
    nameKr: "주한 태국대사관",
    descTh: "หนังสือเดินทาง (พาสปอร์ต) และงานกงสุลไทย",
    descKr: "태국 여권 재발급, 영사 및 태국 정부 행정 서비스",
    url: "https://seoul.thaiembassy.org",
    category: "สถานทูต / Embassy"
  },
  {
    nameTh: "สำนักงานประกันสุขภาพแห่งชาติ (NHIS)",
    nameKr: "국민건강보험공단",
    descTh: "ตรวจสอบสิทธิประกันสุขภาพและการจ่ายเบี้ยประกัน",
    descKr: "외국인 건강보험 자격, 보험료 및 병원 안내",
    url: "https://www.nhis.or.kr",
    category: "สุขภาพ / Medical"
  },
  {
    nameTh: "สวัสดิการการชดเชยอุบัติเหตุจากการทำงาน (KCOMWEL)",
    nameKr: "근로복지공단 (산재보험)",
    descTh: "การยื่นขอรับเงินชดเชยเมื่อเจ็บป่วยหรือบาดเจ็บจากการทำงาน",
    descKr: "산업재해(산재) 신청 및 미지급 임금 대지급금",
    url: "https://www.comwel.or.kr",
    category: "สวัสดิการ / Welfare"
  },
  {
    nameTh: "ระบบการพัฒนาทรัพยากรมนุษย์ (HRD Korea)",
    nameKr: "한국산업인력공단 (EPS)",
    descTh: "ประกันค่าเดินทางกลับประเทศ และเงินชดเชยการออกจากงาน",
    descKr: "귀국비용보험, 출국만기보험 신청 및 수령 안내",
    url: "https://www.hrdkorea.or.kr",
    category: "ประกัน / Insurance"
  },
  {
    nameTh: "เว็บไซต์หางาน Work24 (고용24)",
    nameKr: "고용24 (구 워크넷)",
    descTh: "ค้นหางานอย่างถูกต้องตามกฎหมายและสิทธิประโยชน์",
    descKr: "공식 구직 및 채용 정보, 고용보험 서비스",
    url: "https://www.work24.go.kr",
    category: "หางาน / Jobs"
  },
  {
    nameTh: "ศูนย์จราอุลซาน (รถบัสประจำทาง)",
    nameKr: "울산교통관리센터 (버스정보)",
    descTh: "เช็กเวลารถบัสประจำทางในอุลซานสำหรับการเดินทางไปทำงาน",
    descKr: "울산 공단 출퇴근 버스 실시간 노선 및 시간표",
    url: "https://its.ulsan.kr",
    category: "จราจร / Transport"
  },
  {
    nameTh: "ดานูรี (Danuri Portal)",
    nameKr: "다누리 포털 (생활정보)",
    descTh: "ข้อมูลการดำเนินชีวิตในเกาหลีและสายด่วนช่วยเหลือ (1345/1350)",
    descKr: "다국어 생활 정보 및 긴급 상담 전화 안내",
    url: "https://www.liveinkorea.kr",
    category: "การใช้ชีวิต / Life"
  }
];

export const App: React.FC = () => {
  const [isKorean, setIsKorean] = useState<boolean>(false);
  const [todayVerse, setTodayVerse] = useState<BibleVerse | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'electric' | 'korean' | 'community'>('home');

  const appUrl = "https://moving-thai.vercel.app/";

  // 전기세 분배 계산기 State
  const [totalBill, setTotalBill] = useState<number>(0);
  const [rooms, setRooms] = useState<RoomBill[]>([
    { id: 1, name: 'ห้อง 1 (방 1)', usage: 0, cost: 0 },
    { id: 2, name: 'ห้อง 2 (방 2)', usage: 0, cost: 0 }
  ]);

  // 한국어 배우기 랜덤 7개 추출 State
  const [randomKoreanList, setRandomKoreanList] = useState<KoreanStudyItem[]>([]);

  // 커뮤니티 게시판 State
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [newAuthor, setNewAuthor] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: { author: string; content: string } }>({});

  const getRandomStudyItems = () => {
    const shuffled = [...koreanStudyDatabase].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 7);
  };

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * bibleVerses.length);
    setTodayVerse(bibleVerses[randomIndex]);

    setRandomKoreanList(getRandomStudyItems());

    // Firebase 데이터 실시간 동기화
    const postsRef = ref(db, 'posts');
    const unsubscribe = onValue(postsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedPosts: PostItem[] = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setPosts(loadedPosts.reverse()); // 최신글 상단 정렬
      } else {
        setPosts([]);
      }
    });

    return () => unsubscribe();
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

  // 커뮤니티 게시글 등록
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    const postsRef = ref(db, 'posts');
    push(postsRef, {
      author: newAuthor.trim() || (isKorean ? '익명' : 'ผู้โพสต์'),
      content: newContent,
      likes: 0,
      createdAt: new Date().toLocaleDateString('ko-KR')
    });

    setNewAuthor('');
    setNewContent('');
  };

  // 좋아요 증가
  const handleLikePost = (postId: string, currentLikes: number) => {
    const postRef = ref(db, `posts/${postId}`);
    update(postRef, { likes: currentLikes + 1 });
  };

  // 댓글 입력 상태 관리
  const handleCommentInputChange = (postId: string, field: 'author' | 'content', value: string) => {
    setCommentInputs(prev => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        [field]: value
      }
    }));
  };

  // 댓글 작성
  const handleAddComment = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const input = commentInputs[postId];
    if (!input || !input.content?.trim()) return;

    const commentsRef = ref(db, `posts/${postId}/comments`);
    push(commentsRef, {
      author: input.author?.trim() || (isKorean ? '익명' : 'ผู้ตอบ'),
      content: input.content,
      createdAt: new Date().toLocaleDateString('ko-KR')
    });

    setCommentInputs(prev => ({
      ...prev,
      [postId]: { author: '', content: '' }
    }));
  };

  // 관리자 모드 삭제 (비밀번호: 1234)
  const handleDeletePost = (postId: string) => {
    const password = prompt(isKorean ? "관리자 암호를 입력하세요:" : "กรุณาใส่รหัสผ่านผู้ดูแลระบบ:");
    if (password === '1234') {
      const postRef = ref(db, `posts/${postId}`);
      remove(postRef);
      alert(isKorean ? "삭제되었습니다." : "ลบเรียบร้อยแล้ว");
    } else if (password !== null) {
      alert(isKorean ? "암호가 올바르지 않습니다." : "รหัสผ่านไม่ถูกต้อง");
    }
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    const password = prompt(isKorean ? "관리자 암호를 입력하세요:" : "กรุณาใส่รหัสผ่านผู้ดูแลระบบ:");
    if (password === '1234') {
      const commentRef = ref(db, `posts/${postId}/comments/${commentId}`);
      remove(commentRef);
      alert(isKorean ? "댓글이 삭제되었습니다." : "ลบความคิดเห็นเรียบร้อยแล้ว");
    } else if (password !== null) {
      alert(isKorean ? "암호가 올바르지 않습니다." : "รหัสผ่านไม่ถูกต้อง");
    }
  };

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
        <button 
          className={`nav-btn ${activeTab === 'community' ? 'active' : ''}`}
          onClick={() => setActiveTab('community')}
        >
          {isKorean ? "💬 커뮤니티" : "💬 ชุมชน"}
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
                    ? "우리는 매주 오직 하나님을 예배하는 공동체입니다." 
                    : "เราเป็นชุมชนที่นมัสการพระเจ้าแต่เพียงผู้เดียวทุกสัปดาห์"}
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

      {/* 탭 4: 커뮤니티 페이지 */}
      {activeTab === 'community' && (
        <main className="main-content">
          <section className="page-card">
            <h3>{isKorean ? "💬 자유 게시판" : "💬 กระดานสนทนา"}</h3>
            <p className="page-desc">
              {isKorean 
                ? "자유롭게 글을 남기고 교제하는 공간입니다." 
                : "พื้นที่สำหรับแบ่งปัน พูดคุย และแลกเปลี่ยนความคิดเห็น"}
            </p>

            {/* 글 작성 폼 */}
            <form onSubmit={handleCreatePost} className="post-form">
              <input 
                type="text"
                className="community-input"
                placeholder={isKorean ? "이름 (선택 사항)" : "ชื่อ (ไม่บังคับ)"}
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
              />
              <textarea 
                className="community-textarea"
                placeholder={isKorean ? "내용을 입력하세요..." : "เขียนข้อความที่นี่..."}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                required
              />
              <button type="submit" className="add-room-btn post-submit-btn">
                {isKorean ? "✏️ 글 작성" : "✏️ โพสต์ข้อความ"}
              </button>
            </form>

            {/* 게시글 리스트 */}
            <div className="post-list">
              {posts.length === 0 ? (
                <p className="no-posts">{isKorean ? "등록된 글이 없습니다." : "ยังไม่มีข้อความ"}</p>
              ) : (
                posts.map((post) => {
                  const commentsArray = post.comments 
                    ? Object.keys(post.comments).map(key => ({ ...post.comments![key], id: key })) 
                    : [];

                  return (
                    <div key={post.id} className="post-card">
                      <div className="post-header">
                        <span className="post-author">{post.author}</span>
                        <div className="post-header-right">
                          <span className="post-date">{post.createdAt}</span>
                          <button 
                            className="admin-delete-btn"
                            onClick={() => handleDeletePost(post.id)}
                            title={isKorean ? "관리자 삭제" : "ลบโดยผู้ดูแล"}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      <p className="post-body">{post.content}</p>

                      <div className="post-actions">
                        <button 
                          className="like-btn"
                          onClick={() => handleLikePost(post.id, post.likes)}
                        >
                          ❤️ {isKorean ? "좋아요" : "ถูกใจ"} {post.likes}
                        </button>
                      </div>

                      {/* 댓글 섹션 */}
                      <div className="comments-section">
                        <div className="comments-list">
                          {commentsArray.map((comment) => (
                            <div key={comment.id} className="comment-item">
                              <div className="comment-content-wrapper">
                                <strong>{comment.author}: </strong>
                                <span>{comment.content}</span>
                              </div>
                              <div className="comment-right">
                                <span className="comment-date">{comment.createdAt}</span>
                                <button 
                                  className="admin-comment-delete-btn"
                                  onClick={() => handleDeleteComment(post.id, comment.id)}
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <form onSubmit={(e) => handleAddComment(post.id, e)} className="comment-form">
                          <input 
                            type="text"
                            className="comment-author-input"
                            placeholder={isKorean ? "이름" : "ชื่อ"}
                            value={commentInputs[post.id]?.author || ''}
                            onChange={(e) => handleCommentInputChange(post.id, 'author', e.target.value)}
                          />
                          <input 
                            type="text"
                            className="comment-content-input"
                            placeholder={isKorean ? "댓글 입력..." : "เขียนความคิดเห็น..."}
                            value={commentInputs[post.id]?.content || ''}
                            onChange={(e) => handleCommentInputChange(post.id, 'content', e.target.value)}
                            required
                          />
                          <button type="submit" className="comment-submit-btn">
                            {isKorean ? "등록" : "ส่ง"}
                          </button>
                        </form>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </main>
      )}

      {/* 하단 QR 코드 섹션 */}
      <section className="qr-section" style={{
        backgroundColor: '#ffffff',
        padding: '24px 16px',
        margin: '20px auto 0 auto',
        maxWidth: '600px',
        borderRadius: '12px',
        textAlign: 'center',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
      }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>
          {isKorean ? "📱 카메라로 스캔하여 공유하기" : "📱 สแกนเพื่อเข้าสู่เว็บไซต์"}
        </h4>
        <p style={{ fontSize: '0.85rem', color: '#666', margin: '0 0 16px 0' }}>
          {isKorean ? "상대방 카메라로 찍으면 웹사이트로 연결됩니다." : "สแกน QR Code นี้ด้วยกล้องเพื่อเปิดเว็บไซต์"}
        </p>
        <div style={{ display: 'inline-block', padding: '12px', backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '8px' }}>
          <QRCodeSVG value={appUrl} size={150} level="H" />
        </div>
        <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '8px' }}>{appUrl}</p>
      </section>

      {/* 푸터 */}
      <footer className="footer">
        <p>© 2026 moving Thai (ย้ายไทย) Christian Community in Ulsan. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;