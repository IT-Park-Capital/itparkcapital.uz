import type { Locale } from '~/i18n';

export type ProgramSlug =
  | 'it-companies'
  | 'it-export'
  | 'corporate-education'
  | 'zero-risk'
  | 'bilgi'
  | 'ma-advisory';

type LocalizedProgramBase = {
  title: string;
  shortTitle: string;
  summary: string;
  intro: string;
};

type LoanProgramContent = LocalizedProgramBase & {
  kind: 'loan';
  purpose: string[];
  terms: string[];
  requirements: string[];
};

type ZeroRiskContent = LocalizedProgramBase & {
  kind: 'zero-risk';
  benefits: string[];
  criteria: string[];
  results: { value: string; label: string }[];
};

type BilgiContent = LocalizedProgramBase & {
  kind: 'bilgi';
  terms: string[];
  results: { value: string; label: string }[];
  topCourses: { name: string; share: number }[];
};

type AdvisoryContent = LocalizedProgramBase & {
  kind: 'advisory';
  what: string[];
  who: string[];
};

export type ProgramContent =
  | LoanProgramContent
  | ZeroRiskContent
  | BilgiContent
  | AdvisoryContent;

export type ProgramData = {
  slug: ProgramSlug;
  order: number;
  accent: 'green' | 'dark' | 'light';
  icon: 'building' | 'globe' | 'graduation' | 'shield' | 'grid' | 'handshake';
  content: Record<Locale, ProgramContent>;
};

export const PROGRAMS: ProgramData[] = [
  {
    slug: 'it-companies',
    order: 1,
    accent: 'light',
    icon: 'building',
    content: {
      uz: {
        kind: 'loan',
        title: "IT-kompaniyalar va ta'lim loyihalari uchun maqsadli qarz",
        shortTitle: "IT va ta'lim qarzi",
        summary: "O'quv markazlari va IT-kompaniyalarni kengaytirish, yangi filiallar ochish va jamoa o'sishi uchun.",
        intro: "Dastur O'zbekiston hududlarida kengayishni, yangi filiallar ochishni, ta'lim sifatini oshirishni va jamoani kengaytirishni maqsad qilgan o'quv markazlari hamda IT-kompaniyalar uchun mo'ljallangan.",
        purpose: [
          "O'quv binosini kengaytirish",
          "Yangi ofislar ochish",
          "Zamonaviy texnika bilan jihozlash",
          "Malakali o'qituvchilarni jalb etish",
          "Dasturiy ta'minot xarid qilish",
        ],
        terms: [
          "Summa: 100 mln — 5 mlrd so'm",
          "Imtiyozli davr: 6 oy",
          "Muddat: 3 yilgacha",
          "Yillik stavka: qayta moliyalash stavkasi + 4%",
        ],
        requirements: [
          "IT sohasida ta'lim xizmatlarini ko'rsatish",
          "IT Park Uzbekistan rezidenti maqomi",
          "Barqaror moliyaviy ko'rsatkichlar",
          "Mol-mulk garovi va sug'urta ta'minoti",
          "Bitiruvchilarni ish bilan ta'minlash",
        ],
      },
      ru: {
        kind: 'loan',
        title: "Целевой займ для IT-компаний и образовательных проектов",
        shortTitle: "Займ IT и образование",
        summary: "Для масштабирования образовательных центров и IT-компаний, открытия филиалов и расширения команды.",
        intro: "Программа предназначена для образовательных центров и IT-компаний, стремящихся к масштабированию, открытию новых филиалов в регионах Узбекистана, повышению качества обучения и расширения команды сотрудников.",
        purpose: [
          "Расширение учебного здания",
          "Открытие новых офисов",
          "Оснащение современной техникой",
          "Привлечение квалифицированных преподавателей",
          "Приобретение программного обеспечения",
        ],
        terms: [
          "Сумма: от 100 млн до 5 млрд сумов",
          "Льготный период: 6 месяцев",
          "Срок погашения: до 3-х лет",
          "Годовая ставка рефинансирования + 4%",
        ],
        requirements: [
          "Оказание образовательных услуг в сфере IT",
          "Статус резидента IT Park Uzbekistan",
          "Устойчивые финансовые показатели",
          "Залог имущества, страховое обеспечение",
          "Обеспечение выпускников трудоустройством",
        ],
      },
      en: {
        kind: 'loan',
        title: "Targeted loan for IT companies and educational projects",
        shortTitle: "IT & education loan",
        summary: "Scaling educational centres and IT companies, opening new branches, and expanding teams.",
        intro: "This programme is designed for educational centres and IT companies seeking to scale up their operations, open new branches across Uzbekistan, improve the quality of teaching, and expand their workforce.",
        purpose: [
          "Expansion of educational premises",
          "Opening new offices",
          "Purchasing modern equipment",
          "Recruiting qualified teaching staff",
          "Purchasing software",
        ],
        terms: [
          "Amount: from 100 million to 5 billion soums",
          "Grace period: 6 months",
          "Repayment term: up to 3 years",
          "Annual refinancing rate + 4%",
        ],
        requirements: [
          "Provision of educational services in the IT sector",
          "Resident status at IT Park Uzbekistan",
          "Stable financial performance",
          "Collateral and insurance cover",
          "Guarantee of graduate employment",
        ],
      },
    },
  },
  {
    slug: 'it-export',
    order: 2,
    accent: 'green',
    icon: 'globe',
    content: {
      uz: {
        kind: 'loan',
        title: "IT-xizmatlar eksportini amalga oshiruvchi kompaniyalar uchun maqsadli qarz",
        shortTitle: "Eksport qarzi",
        summary: "Eksport shartnomalari bo'yicha majburiyatlar, operatsion xarajatlar va pul oqimi uzilishlarini bartaraf etish.",
        intro: "Dastur eksport xizmatlarini ko'rsatuvchi IT Park rezidentlari uchun mo'ljallangan.",
        purpose: [
          "Zamonaviy ofis xarid qilish",
          "Eksport shartnomalari bo'yicha majburiyatlarni bajarish",
          "Operatsion xarajatlarni qoplash",
          "Pul oqimidagi uzilishlarni bartaraf etish",
        ],
        terms: [
          "Summa: 100 mln — 5 mlrd so'm",
          "Imtiyozli davr: 6 oy",
          "Muddat: 12–36 oy",
          "Yillik stavka: qayta moliyalash stavkasi + 4%",
        ],
        requirements: [
          "Kamida 12 oy davomida IT-xizmatlar eksporti, amaldagi eksport shartnomasi kamida 30% bajarilgan bo'lishi",
          "IT Park Uzbekistan rezidenti maqomi",
          "Barqaror moliyaviy va iqtisodiy ko'rsatkichlar, kreditni qaytarish qobiliyati",
          "Mol-mulk garovi, sug'urta ta'minoti yoki bank kafolati (garov qiymati kredit summasining kamida 130%)",
          "2 yil ichida eksport hajmining kamida 30% ga o'sishi",
          "Yoshlar (16–35 yosh) uchun ish o'rinlarini yiliga kamida 10% ga oshirish",
        ],
      },
      ru: {
        kind: 'loan',
        title: "Целевой займ для компаний оказывающих экспорт IT-услуг",
        shortTitle: "Экспортный займ",
        summary: "Покрытие обязательств по экспортным контрактам, операционных расходов и кассовых разрывов.",
        intro: "Программа направлена на IT-резидентов IT Park, оказывающих экспортные услуги.",
        purpose: [
          "Покупка современного офиса",
          "Выполнение обязательств по экспортным контрактам",
          "Покрытие операционных расходов",
          "Устранение кассовых разрывов",
        ],
        terms: [
          "Сумма: от 100 млн до 5 млрд сумов",
          "Льготный период: 6 месяцев",
          "Срок: 12–36 месяцев",
          "Годовая ставка рефинансирования + 4%",
        ],
        requirements: [
          "Экспорт IT-услуг не менее 12 месяцев, действующий экспортный контракт исполнен более чем на 30%",
          "Статус резидента IT Park Uzbekistan",
          "Устойчивые финансовые и экономические показатели, способность погашать кредит",
          "Залог имущества, страховой залог, банковская гарантия (стоимость залога — не менее 130% от суммы кредита)",
          "Рост экспорта не менее чем на 30% в течение 2 лет",
          "Увеличение рабочих мест для молодёжи (16–35 лет) на 10% в год",
        ],
      },
      en: {
        kind: 'loan',
        title: "Targeted loan for companies providing IT export services",
        shortTitle: "Export loan",
        summary: "Fulfilling export contract obligations, covering operating expenses, bridging cash flow gaps.",
        intro: "The programme is aimed at IT Park residents providing export IT services.",
        purpose: [
          "Purchase of modern office premises",
          "Fulfilment of obligations under export contracts",
          "Covering operating expenses",
          "Bridging cash flow gaps",
        ],
        terms: [
          "Amount: from 100 million to 5 billion soums",
          "Grace period: 6 months",
          "Term: 12–36 months",
          "Annual refinancing rate + 4%",
        ],
        requirements: [
          "Export of IT services for at least 12 months; current export contract fulfilled by more than 30%",
          "Resident status at IT Park Uzbekistan",
          "Stable financial and economic indicators; ability to repay the loan",
          "Collateral in the form of property, insurance pledge or bank guarantee (value of collateral — at least 130% of the loan amount)",
          "Export growth of at least 30% over 2 years",
          "Increase in jobs for young people (aged 16–35) by 10% per year",
        ],
      },
    },
  },
  {
    slug: 'corporate-education',
    order: 3,
    accent: 'light',
    icon: 'graduation',
    content: {
      uz: {
        kind: 'loan',
        title: "Xodimlarni korporativ o'qitish uchun maqsadli qarz",
        shortTitle: "Korporativ o'qitish",
        summary: "IT-kompaniyalar xodimlari malakasini oshirish va yangi ish o'rinlari yaratish uchun.",
        intro: "Dastur IT-kompaniyalar xodimlarining malakasi va bilimlarini oshirish, shuningdek yangi ish o'rinlarini yaratishga qaratilgan.",
        purpose: [
          "Yangi xodimlarni o'qitish",
          "Yangi ko'nikmalarni egallash va mavjud jamoani kuchaytirish",
          "Kompetensiyalar yetishmasligini bartaraf etish",
        ],
        terms: [
          "Summa: 100 mln — 5 mlrd so'm",
          "Imtiyozli davr: 6 oy",
          "Muddat: 12–36 oy",
          "Yillik stavka: qayta moliyalash stavkasi + 4%",
        ],
        requirements: [
          "IT sohasida ta'lim xizmatlarini ko'rsatish",
          "IT Park Uzbekistan rezidenti maqomi",
          "Barqaror moliyaviy ko'rsatkichlar",
          "Mol-mulk garovi va sug'urta ta'minoti",
          "Bitiruvchilarni ish bilan ta'minlash",
        ],
      },
      ru: {
        kind: 'loan',
        title: "Целевой займ на корпоративное обучение сотрудников",
        shortTitle: "Корпоративное обучение",
        summary: "Повышение квалификации сотрудников IT-компаний и создание новых рабочих мест.",
        intro: "Программа предназначена на повышение квалификации и знаний сотрудников IT-компаний, а также увеличению рабочих мест.",
        purpose: [
          "Обучение новых сотрудников",
          "Приобретение новых навыков и усиление текущей команды",
          "Закрытие нехватки компетенций",
        ],
        terms: [
          "Сумма: от 100 млн до 5 млрд сумов",
          "Льготный период: 6 месяцев",
          "Срок: 12–36 месяцев",
          "Годовая ставка рефинансирования + 4%",
        ],
        requirements: [
          "Оказание образовательных услуг в сфере IT",
          "Статус резидента IT Park Uzbekistan",
          "Устойчивые финансовые показатели",
          "Залог имущества, страховое обеспечение",
          "Обеспечение выпускников трудоустройством",
        ],
      },
      en: {
        kind: 'loan',
        title: "Targeted loan for corporate education of employees",
        shortTitle: "Corporate training",
        summary: "Upskilling IT company employees and creating new jobs.",
        intro: "The programme is designed to enhance the skills and knowledge of IT company employees, as well as to create new jobs.",
        purpose: [
          "Training new employees",
          "Acquiring new skills and strengthening the current team",
          "Addressing skills gaps",
        ],
        terms: [
          "Amount: from 100 million to 5 billion soums",
          "Grace period: 6 months",
          "Term: 12–36 months",
          "Annual refinancing rate + 4%",
        ],
        requirements: [
          "Provision of educational services in the IT sector",
          "Resident status at IT Park Uzbekistan",
          "Stable financial performance",
          "Collateral and insurance cover",
          "Guarantee of employment for graduates",
        ],
      },
    },
  },
  {
    slug: 'zero-risk',
    order: 4,
    accent: 'dark',
    icon: 'shield',
    content: {
      uz: {
        kind: 'zero-risk',
        title: "Incentives (Zero Risk) dasturi",
        shortTitle: "Zero Risk",
        summary: "IT va BPO kompaniyalarni O'zbekistonga jalb qilish — ofis, jihoz va kompensatsiyalar bilan.",
        intro: "Incentives (Zero Risk) — IT va BPO kompaniyalarni O'zbekistonga jalb qilishga qaratilgan davlat dasturi bo'lib, IT-kompaniyalarga start bosqichida moliyaviy xatarlarni minimallashtirgan holda o'sish va kengayish imkonini beradi. Dastur jamoa, infratuzilma va rivojlanishga yo'naltirilgan investitsiyalardagi asosiy yuklamalarni kamaytiradi. Dasturning asosiy maqsadi — IT va BPO kompaniyalarga O'zbekiston bozoriga kirish va minimal xatarlar bilan kengayish imkoniyatini yaratish.",
        benefits: [
          "12 oygacha barcha hududlarda bepul ofis maydonlari (Toshkentdan tashqari)",
          "Texnik jihozlar bilan ta'minlash (12 oydan so'ng sotib olish majburiyati bilan)",
          "Ish haqi kompensatsiyasi — 15% gacha",
          "Xodimlarni o'qitish xarajatlari kompensatsiyasi — 50% gacha ($6 000 dan oshmagan holda)",
          "Xodimlarni yollash xarajatlari kompensatsiyasi — 50% gacha (har bir xodim uchun $600 dan oshmagan holda)",
        ],
        criteria: [
          "Daromadning 50% dan ortig'i IT-xizmatlar eksportidan shakllanishi",
          "Kamida $500 000 miqdorida amaldagi eksport shartnomasi mavjud bo'lishi",
          "Bosh kompaniya aylanmasi — $1 mln dan boshlab",
        ],
        results: [
          { value: '95', label: "qabul qilingan ariza" },
          { value: '74', label: "qabul qilingan kompaniya" },
          { value: '2 500+', label: "yaratilgan ish o'rni" },
          { value: '3 500', label: "yil oxiriga rejalashtirilgan ish o'rni" },
          { value: '$800K+', label: "xarid qilingan jihozlar qiymati" },
          { value: '$42M+', label: "yillik eksport hajmi" },
        ],
      },
      ru: {
        kind: 'zero-risk',
        title: "Программа Incentives (Zero Risk)",
        shortTitle: "Zero Risk",
        summary: "Привлечение IT и BPO компаний в Узбекистан — офис, оборудование и компенсации.",
        intro: "Incentives (Zero Risk) — государственная программа привлечения IT и BPO компаний в Узбекистан, позволяет IT-компаниям расти и масштабироваться с минимизацией финансовых рисков на старте, снижая ключевые нагрузки при инвестициях в команду, инфраструктуру и развитие. Главная цель программы — обеспечить IT и BPO компаниям возможность войти на рынок Узбекистана и масштабироваться с минимальными рисками.",
        benefits: [
          "Бесплатные офисные площади на срок до 12 месяцев во всех регионах (кроме Ташкента)",
          "Оснащение техническим оборудованием (с обязательством выкупа через 12 месяцев)",
          "Компенсация заработной платы — до 15%",
          "Компенсация расходов на обучение сотрудников — до 50% (но не более $6 000)",
          "Компенсация расходов на подбор персонала — до 50% (не более $600 на сотрудника)",
        ],
        criteria: [
          "Более 50% выручки с экспорта услуг",
          "Действующий экспортный контракт на сумму от $500 000+",
          "Оборот головной компании — от $1 млн",
        ],
        results: [
          { value: '95', label: "принятая заявка" },
          { value: '74', label: "принятых компаний" },
          { value: '2 500+', label: "созданных рабочих мест" },
          { value: '3 500', label: "рабочих мест к концу года" },
          { value: '$800K+', label: "стоимость оборудования" },
          { value: '$42M+', label: "годовой объём экспорта" },
        ],
      },
      en: {
        kind: 'zero-risk',
        title: "Incentives (Zero Risk) Programme",
        shortTitle: "Zero Risk",
        summary: "Attracting IT and BPO companies to Uzbekistan — with offices, equipment, and subsidies.",
        intro: "Incentives (Zero Risk) — is a government programme designed to attract IT and BPO companies to Uzbekistan. It enables IT companies to grow and scale up whilst minimising financial risks at the outset, reducing the key burdens associated with investing in staff, infrastructure and development. The main objective of the programme is to provide IT and BPO companies with the opportunity to enter the Uzbek market and scale up with minimal risk.",
        benefits: [
          "Free office space for up to 12 months in all regions (except Tashkent)",
          "Provision of technical equipment (with an obligation to purchase after 12 months)",
          "Salary subsidy — up to 15%",
          "Reimbursement of staff training costs — up to 50% (but not exceeding $6,000)",
          "Reimbursement of recruitment costs — up to 50% (up to $600 per employee)",
        ],
        criteria: [
          "Over 50% of revenue from the export of IT services",
          "A valid export contract worth $500,000 or more",
          "Parent company turnover — from $1 million",
        ],
        results: [
          { value: '95', label: "applications accepted" },
          { value: '74', label: "companies accepted" },
          { value: '2,500+', label: "jobs created" },
          { value: '3,500', label: "jobs planned by year-end" },
          { value: '$800K+', label: "equipment value" },
          { value: '$42M+', label: "annual export volume" },
        ],
      },
    },
  },
  {
    slug: 'bilgi',
    order: 5,
    accent: 'light',
    icon: 'grid',
    content: {
      uz: {
        kind: 'bilgi',
        title: "Bilgi marketpleysi",
        shortTitle: "Bilgi",
        summary: "100+ o'quv markazlari, 520+ IT-kurs va 16-35 yoshdagi yoshlar uchun imtiyozli muddatli to'lov.",
        intro: "Bilgi onlayn platformasi 100+ o'quv markazlarini birlashtirib, IT-ko'nikmalarini rivojlantirish va turli sohalarda o'z yo'nalishingizni topishga yordam beradi. Ekotizim mamlakatdagi o'quv markazlarini birlashtirib, ta'lim olish uchun qulay va foydali shartlarni taklif etadi.",
        terms: [
          "Imtiyozli davr: 2 oy",
          "Muddatli to'lov: 12 oy",
          "16–35 yoshdagi fuqarolar uchun",
        ],
        results: [
          { value: '520', label: "IT-kurs" },
          { value: '105', label: "o'quv markazi" },
          { value: '3 000+', label: "talaba" },
          { value: '1 200+', label: "amaldagi talaba" },
          { value: '2 300', label: "tayyorlangan talaba" },
          { value: '60%', label: "yetakchi IT-kompaniyalarda ish bilan ta'minlangan" },
        ],
        topCourses: [
          { name: "Dasturlash", share: 56.1 },
          { name: "Veb-dasturlash", share: 18.7 },
          { name: "Grafik dizayn", share: 8.4 },
          { name: "Kiberxavfsizlik", share: 7.8 },
          { name: "Tizim administratorligi", share: 3.0 },
          { name: "Ma'lumotlar tahlili", share: 1.9 },
          { name: "Boshqalar", share: 4.1 },
        ],
      },
      ru: {
        kind: 'bilgi',
        title: "Маркетплейс Bilgi",
        shortTitle: "Bilgi",
        summary: "100+ учебных центров, 520+ IT-курсов и рассрочка для молодёжи 16–35 лет.",
        intro: "Онлайн платформа Bilgi с более 100+ учебными центрами, которая помогает развивать IT-навыки и найти своё направление в различных отраслях. Экосистема объединила учебные центры страны, предлагая удобные и выгодные условия для обучения.",
        terms: [
          "Льготный период: 2 месяца",
          "Срок рассрочки: 12 месяцев",
          "Для граждан в возрасте от 16 до 35 лет",
        ],
        results: [
          { value: '520', label: "IT-курсов" },
          { value: '105', label: "учебных центров" },
          { value: '3 000+', label: "студентов" },
          { value: '1 200+', label: "действующих студентов" },
          { value: '2 300', label: "подготовленных студентов" },
          { value: '60%', label: "трудоустроены в ведущих IT-компаниях" },
        ],
        topCourses: [
          { name: "Программирование", share: 56.1 },
          { name: "Веб-разработка", share: 18.7 },
          { name: "Графический дизайн", share: 8.4 },
          { name: "Кибербезопасность", share: 7.8 },
          { name: "Системное администрирование", share: 3.0 },
          { name: "Анализ данных", share: 1.9 },
          { name: "Другие", share: 4.1 },
        ],
      },
      en: {
        kind: 'bilgi',
        title: "Bilgi Marketplace",
        shortTitle: "Bilgi",
        summary: "100+ training centres, 520+ IT courses, and instalment plans for ages 16–35.",
        intro: "The Bilgi online platform, with more than 100 training centres, helps people develop IT skills and find their niche in various industries. The ecosystem brings together training centres across the country, offering convenient and affordable learning opportunities.",
        terms: [
          "Grace period: 2 months",
          "Repayment term: 12 months",
          "For citizens aged 16 to 35",
        ],
        results: [
          { value: '520', label: "IT courses" },
          { value: '105', label: "training centres" },
          { value: '3,000+', label: "students" },
          { value: '1,200+', label: "current students" },
          { value: '2,300', label: "graduates" },
          { value: '60%', label: "employed by leading IT companies" },
        ],
        topCourses: [
          { name: "Programming", share: 56.1 },
          { name: "Web development", share: 18.7 },
          { name: "Graphic design", share: 8.4 },
          { name: "Cybersecurity", share: 7.8 },
          { name: "System administration", share: 3.0 },
          { name: "Data analysis", share: 1.9 },
          { name: "Others", share: 4.1 },
        ],
      },
    },
  },
  {
    slug: 'ma-advisory',
    order: 6,
    accent: 'dark',
    icon: 'handshake',
    content: {
      uz: {
        kind: 'advisory',
        title: "M&A va moliyaviy konsalting",
        shortTitle: "M&A konsalting",
        summary: "IT-kompaniyalar uchun qo'shilish va qo'shib olish bitimlarida to'liq qo'llab-quvvatlash.",
        intro: "Biz IT-kompaniyalarni qo'shilish va qo'shib olish (M&A) bitimlarida — dastlabki baholashdan tortib bitimni yopishgacha to'liq qo'llab-quvvatlaymiz. Sotuvchi va xaridor tomonida ham ishlaymiz.",
        what: [
          "Biznesni baholash — moliyaviy modellashtirish, o'xshash bitimlarni tahlil qilish, DCF va multiplikator usullari asosida, O'zbekiston IT bozori xususiyatlarini inobatga olgan holda",
          "Bitimga tayyorgarlik — aktivlarni strukturalash, sotuvchi tomondan due diligence, axborot memorandumi tayyorlash",
          "Investor yoki xaridor topish — mintaqa va undan tashqaridagi strategik va moliyaviy investorlar tarmog'iga kirish imkoniyati",
          "Bitimni strukturalash — optimal shaklni tanlash: asset deal, share deal, strategik hamkorlik, qisman chiqish",
          "Muzokaralarni qo'llab-quvvatlash — imzolash va yopishgacha bo'lgan barcha bosqichlarda yordam",
        ],
        who: [
          "Qisman yoki to'liq chiqishga tayyorlanayotgan IT-kompaniyalar asoschilari",
          "M&A'ni o'sish vositasi sifatida ko'rayotgan korporatsiyalar",
          "Mintaqada bitimlarni tahlil qilish va strukturalash uchun mahalliy hamkorga muhtoj investorlar",
        ],
      },
      ru: {
        kind: 'advisory',
        title: "M&A и финансовые консультации",
        shortTitle: "M&A консалтинг",
        summary: "Полное сопровождение IT-компаний на сделках слияний и поглощений.",
        intro: "Мы сопровождаем IT-компании на сделках слияний и поглощений — от первичной оценки до закрытия транзакции. Работаем как со стороны продавца, так и покупателя.",
        what: [
          "Оценка бизнеса — финансовое моделирование, анализ сопоставимых сделок, DCF и мультипликаторный подход с учётом специфики IT-рынка Узбекистана",
          "Подготовка к сделке — структурирование активов, due diligence со стороны продавца, подготовка информационного меморандума",
          "Поиск инвестора или покупателя — доступ к сети стратегических и финансовых инвесторов в регионе и за его пределами",
          "Структурирование сделки — выбор оптимальной формы: asset deal, share deal, стратегическое партнёрство, частичный выход",
          "Сопровождение переговоров — поддержка на всех этапах до подписания и закрытия",
        ],
        who: [
          "Основателям IT-компаний, готовящимся к частичному или полному выходу",
          "Корпорациям, рассматривающим M&A как инструмент роста",
          "Инвесторам, которым нужен локальный партнёр для анализа и структурирования сделок в регионе",
        ],
      },
      en: {
        kind: 'advisory',
        title: "M&A and financial advisory",
        shortTitle: "M&A advisory",
        summary: "End-to-end support for IT companies on mergers and acquisitions.",
        intro: "We support IT companies throughout mergers and acquisitions – from the initial valuation to the closing of the transaction. We work on behalf of both sellers and buyers.",
        what: [
          "Business valuation — financial modelling, analysis of comparable transactions, DCF and multiples-based approaches, taking into account the specific characteristics of the IT market in Uzbekistan",
          "Transaction preparation — asset structuring, seller's due diligence, preparation of an information memorandum",
          "Search for an investor or buyer — access to a network of strategic and financial investors in the region and beyond",
          "Transaction structuring — selection of the optimal form: asset deal, share deal, strategic partnership, partial exit",
          "Negotiation support — assistance at all stages up to signing and closing",
        ],
        who: [
          "Founders of IT companies preparing for a partial or full exit",
          "Corporations viewing M&A as a growth tool",
          "Investors requiring a local partner to analyse and structure deals in the region",
        ],
      },
    },
  },
];

export function getProgram(slug: ProgramSlug): ProgramData {
  const p = PROGRAMS.find((x) => x.slug === slug);
  if (!p) throw new Error(`Unknown program slug: ${slug}`);
  return p;
}

export function programsOrdered(): ProgramData[] {
  return [...PROGRAMS].sort((a, b) => a.order - b.order);
}
