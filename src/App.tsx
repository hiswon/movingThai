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

interface UsefulLink {
  nameTh: string;
  nameKr: string;
  descTh: string;
  descKr: string;
  url: string;
  category: string;
}

const bibleVerses: BibleVerse[] = [
  { th: "เพราะว่าพระเจ้าทรงรักโลกจนได้ทรงประทานพระบุตรองค์เดียวของพระองค์", kr: "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니", refTh: "(ยอห์น 3:16)", refKr: "(요 3:16)" },
  { th: "พระยาห์เวห์ทรงเป็นผู้เลี้ยงดูข้าพเจ้า ข้าพเจ้าจะไม่ขัดสน", kr: "여호와는 나의 목자시นิ 내게 부족함이 없으ไรโดา", refTh: "(สดุดี 23:1)", refKr: "(시 23:1)" },
  { th: "บรรดาผู้เหน็ดเหนื่อยและแบกภาระหนัก จงมาหาเรา และเราจะให้ท่านทั้งหลายหายเหนื่อยเป็นสุข", kr: "수고하고 짐 진 자들아 다 내게로 오라 내가 너희를 쉬게 하리라", refTh: "(แมทธิว 11:28)", refKr: "(마 11:28)" },
  { th: "ข้าพเจ้าเผชิญทุกสิ่งได้โดยพระองค์ผู้ทรงเสริมกำลังข้าพเจ้า", kr: "내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라", refTh: "(ฟิลิปปี 4:13)", refKr: "(빌 4:13)" },
  { th: "จงวางใจในพระยาห์เวห์ด้วยสุดใจของเจ้า และอย่าพึ่งพาความเข้าใจของตนเอง", kr: "너는 마음을 다하여 여호와를 신뢰하고 네 명철을 의지하지 말라", refTh: "(สุภาษิต 3:5)", refKr: "(잠 3:5)" },
  { th: "พระธรรมคำสั่งของพระองค์เป็นตะเกียงแก่เท้าของข้าพระองค์ และเป็นแสงสว่างแก่ทางของข้าพระองค์", kr: "주의 말씀은 내 발에 등이요 내 길에 빛이니이다", refTh: "(สดุดี 119:105)", refKr: "(시 119:105)" },
  { th: "จงทูลขอแล้วจะได้ จงแสวงหาแล้วจะพบ จงเคาะแล้วจะเปิดให้แก่ท่าน", kr: "구하라 그리하면 너희에게 주실 것이요 찾으라 그리하면 찾아낼 것이요 문을 두드리라 그리하면 너희에게 열릴 것이니", refTh: "(แมทธิว 7:7)", refKr: "(마 7:7)" },
  { th: "เหตุฉะนั้นถ้าใครอยู่ในพระคริสต์ เขาก็เป็นคนที่ถูกสร้างใหม่แล้ว", kr: "그런즉 누구든지 그리스도 안에 있으면 새로운 피조물이라", refTh: "(2 โครินธ์ 5:17)", refKr: "(고후 5:17)" },
  { th: "ความรักนั้นก็อดทนนานและมีใจปรานี ความรักไม่อิจฉา ไม่อวดตัว ไม่จองหอง", kr: "사랑은 오래 참고 사랑은 온유하며 시기하지 아니하며 자랑하지 아니하며 교만하지 아니하며", refTh: "(1 โครินธ์ 13:4)", refKr: "(고전 13:4)" },
  { th: "จงชื่นชมยินดีอยู่เสมอ จงอธิษฐานอย่างสม่ำเสมอ จงขอบพระคุณในทุกกรณี", kr: "항상 기뻐하라 쉬지 말고 기도하라 범사에 감사하라", refTh: "(1 ธีสสะโลนิกา 5:16-18)", refKr: "(살전 5:16-18)" },
  // ... 필요시 50개까지 확장 가능
];

// 울산 태국 노동자를 위한 필수 링크 10선
const usefulLinks: UsefulLink[] = [
  {
    nameTh: "ระบบ HiKorea (ไฮโคเรีย)",
    nameKr: "하이코리아 (출입국 민원)",
    descTh: "จองคิว จองเวลา และต่ออายุวีซ่า/เปลี่ยนที่อยู่",
    descKr: "비자 연장, 주소지 변경, 출입국 방문 예약",
    url: "https://www.hikorea.go.kr",
    category: "วีซ่า / Visa"
  },
  {
    nameTh: "ระบบ EPS (การจ้างงาน)",
    nameKr: "EPS 외국인고용ระบบ",
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
    nameKr: "주한 태국대สา관",
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
    nameKr: "한국산업인력공단 (EPSประกัน)",
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

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * bibleVerses.length);
    setTodayVerse(bibleVerses[randomIndex]);
  }, []);

  const toggleLanguage = () => {
    setIsKorean(prev => !prev);
  };

  return (
    <div className="app-container">
      {/* 상단 내비게이션 */}
      <header className="header">
        <div className="logo">
          <h1>ย้ายไทย <span>(moving Thai)</span></h1>
        </div>
        <button className="lang-toggle-btn" onClick={toggleLanguage}>
          {isKorean ? "🇹🇭 ภาษาไทย" : "🇰🇷 한국어 번역"}
        </button>
      </header>

      {/* 히어로 비주얼 섹션 */}
      <section className="hero-section">
        <div className="hero-image-wrapper">
          <img src={pic1} alt="Community 1" className="hero-img main-img" />
          <img src={pic2} alt="Community 2" className="hero-img sub-img" />
        </div>
        <div className="hero-text">
          <h2>
            {isKorean 
              ? "울산 태국 노동자들을 위한 따뜻한 공동체" 
              : "ยินดีต้อนรับสู่ชุมชนคริสเตียนไทยในอุลซาน"}
          </h2>
          <p>
            {isKorean 
              ? "하나님의 사랑 안에서 쉬어가며 힘을 얻는 공간입니다." 
              : "พื้นที่แห่งความรัก ขอพระเจ้าทรงนำและเสริมกำลังในการทำงานและการดำเนินชีวิต"}
          </p>
        </div>
      </section>

      {/* 정중앙: 오늘의 말씀 (Random Bible Verse) */}
      <main className="main-content">
        <section className="verse-card">
          <span className="verse-badge">
            {isKorean ? "오늘의 말씀" : "ข้อพระธรรมวันนี้"}
          </span>
          {todayVerse && (
            <div className="verse-body">
              <p className="verse-text">
                "{isKorean ? todayVerse.kr : todayVerse.th}"
              </p>
              <p className="verse-ref">
                {isKorean ? todayVerse.refKr : todayVerse.refTh}
              </p>
            </div>
          )}
        </section>

        {/* 10가지 필수 웹사이트 링크 섹션 */}
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
              <a 
                key={idx} 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="link-card"
              >
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

        {/* 갤러리 및 서브 이미지 섹션 */}
        <section className="gallery-section">
          <div className="gallery-card">
            <img src={pic3} alt="Community 3" />
            <div className="gallery-desc">
              <h4>{isKorean ? "함께하는 예배와 교제" : "การนมัสการและสามัคคีธรรม"}</h4>
              <p>
                {isKorean 
                  ? "매주 일요일, 울산에서 태국어 예배와 따뜻한 교제가 준비되어 있습니다." 
                  : "มาร่วมรับพรและสามัคคีธรรมร่วมกันทุกวันอาทิตย์"}
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* 푸터 */}
      <footer className="footer">
        <p>© 2026 moving Thai (ย้ายไทย) Christian Community in Ulsan. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;