import type { Locale } from '~/i18n';

export type TimelineEntry = {
  year: string;
  title: string;
  body: string;
};

export type AboutContent = {
  title: string;
  lead: string;
  paragraphs: string[];
  missionTitle: string;
  mission: string;
  timeline: TimelineEntry[];
};

export const ABOUT: Record<Locale, AboutContent> = {
  uz: {
    title: "Biz haqimizda",
    lead: "IT Park Capital — O'zbekiston IT sohasini qo'llab-quvvatlovchi moliyaviy institutdir.",
    paragraphs: [
      "Tashkilot O'zbekiston Respublikasi Vazirlar Mahkamasining 2021-yil 31-avgustdagi 556-sonli «Axborot texnologiyalari va kompyuter dasturlash sohasida yosh mutaxassislarni qo'llab-quvvatlash bo'yicha qo'shimcha chora-tadbirlar to'g'risida»gi qarori ijrosini ta'minlash maqsadida tashkil etilgan.",
      "2025-yil sentyabr oyigacha IT Park Capital, IT Bilim — IT bilimlarini rivojlantirish markazi sifatida faoliyat yuritgan. IT Bilim qisqa vaqt ichida O'zbekiston IT sohasining rivojlanishida muhim drayverga aylanib, to'liq ekotizimni shakllantirdi: ta'limdan tortib o'quv markazlarini infratuzilmaviy qo'llab-quvvatlash, ishga joylashtirish, stajirovkalar va mutaxassislarni xalqaro darajaga olib chiqishgacha. Bilgi.uz platformasining ishga tushirilishi, bandlik dasturlari va Pearson VUE sertifikatsiya markazi IT-ta'limga kirishni kengaytirib, malakali kadrlar oqimini shakllantirishga xizmat qildi.",
      "Ekotizim nafaqat mutaxassislar tayyorlashga, balki butun bozor rivojiga ta'sir qila boshlagan bosqichga yetgach, tashkilot IT Park Capital sifatida transformatsiya qilindi. Bu ta'lim modelidan sohani kompleks qo'llab-quvvatlashga o'tishda muhim qadam bo'ldi — moliyalashtirish, IT-kompaniyalar o'sishi, yangi ish o'rinlari yaratish va eksport salohiyatini rivojlantirishga yo'naltirilgan.",
    ],
    missionTitle: "Bizning missiyamiz",
    mission: "IT Park Capital'ning asosiy missiyasi — IT-kompaniyalar o'sishi va kengayishi uchun barqaror ekotizim yaratish orqali mamlakat raqamli iqtisodiyotining rivojlanishiga hissa qo'shishdir. Biz tadbirkorlarga moliyaviy instrumentlar, ekspert qo'llab-quvvatlash va xalqaro bozorlarga chiqish imkoniyatlarini taqdim etishga intilamiz, shu orqali innovatsiyalar, texnologik taraqqiyot va yoshlar uchun yangi ish o'rinlari yaratilishiga xizmat qilamiz.",
    timeline: [
      {
        year: "2021",
        title: "Tashkilotning tashkil etilishi",
        body: "Vazirlar Mahkamasining 2021-yil 31-avgustdagi 556-sonli qarori asosida IT Bilim — IT bilimlarini rivojlantirish markazi sifatida faoliyat boshlandi.",
      },
      {
        year: "2022–2024",
        title: "Ekotizim shakllanishi",
        body: "Bilgi.uz platformasi ishga tushirildi, Pearson VUE sertifikatsiya markazi ochildi. 100+ o'quv markazi bilan hamkorlik o'rnatildi, bandlik dasturlari yo'lga qo'yildi.",
      },
      {
        year: "2025",
        title: "IT Park Capital sifatida transformatsiya",
        body: "Sentyabr oyida tashkilot IT Park Capital'ga aylantirildi. Endi faoliyat doirasi moliyalashtirish, M&A konsalting va davlat dasturlarini ham qamrab oladi.",
      },
    ],
  },
  ru: {
    title: "О нас",
    lead: "IT Park Capital — финансовый институт поддержки IT-отрасли Узбекистана.",
    paragraphs: [
      "Организация создана во исполнение Постановления Кабинета Министров Республики Узбекистан № 556 от 31 августа 2021 года «О дополнительных мерах по стимулированию молодых специалистов в сфере информационных технологий и компьютерного программирования».",
      "До сентября 2025 года, IT Park Capital функционировала, как IT Bilim — Центр развития IT знаний. IT-Bilim за короткий период стал ключевым драйвером развития IT-отрасли Узбекистана, выстроив полноценную экосистему: от обучения и инфраструктурной поддержки образовательных центров до трудоустройства, стажировок и выхода специалистов на международный уровень. Запуск платформы Bilgi.uz, программ занятости и сертификационного центра Pearson VUE позволил масштабировать доступ к IT-образованию и сформировать устойчивый поток квалифицированных кадров.",
      "Достигнув уровня, при котором экосистема начала влиять не только на подготовку специалистов, но и на развитие рынка в целом, организация трансформировалась в IT Park Capital. Это стало большим шагом для перехода от образовательной модели к комплексной поддержке отрасли — с фокусом на финансирование, рост IT-компаний, создание рабочих мест и развитие экспортного потенциала.",
    ],
    missionTitle: "Наша миссия",
    mission: "Основная миссия IT Park Capital — создание устойчивой экосистемы для роста и масштабирования IT-компаний, способствующей развитию цифровой экономики страны. Мы стремимся обеспечить предпринимателей доступом к финансовым инструментам, экспертной поддержке и возможностям выхода на международные рынки, тем самым формируя благоприятную среду для инноваций, технологического прогресса и созданию новых рабочих мест для молодежи.",
    timeline: [
      {
        year: "2021",
        title: "Создание организации",
        body: "По Постановлению Кабинета Министров №556 от 31 августа 2021 года начата работа как IT Bilim — Центр развития IT знаний.",
      },
      {
        year: "2022–2024",
        title: "Формирование экосистемы",
        body: "Запущена платформа Bilgi.uz, открыт сертификационный центр Pearson VUE. Налажено партнёрство со 100+ учебными центрами, реализованы программы занятости.",
      },
      {
        year: "2025",
        title: "Трансформация в IT Park Capital",
        body: "В сентябре организация преобразована в IT Park Capital. Направления работы расширены до финансирования, M&A-консалтинга и госпрограмм.",
      },
    ],
  },
  en: {
    title: "About us",
    lead: "IT Park Capital is the financial institution that supports the IT sector in Uzbekistan.",
    paragraphs: [
      "The organisation was established in accordance with Resolution No. 556 of the Cabinet of Ministers of the Republic of Uzbekistan dated 31 August 2021, “On additional measures to encourage young professionals in the field of information technology and computer programming”.",
      "Until September 2025, IT Park Capital operated as IT Bilim — the Centre for the Development of IT Knowledge. In a short period, IT-Bilim became a key driver of the development of Uzbekistan's IT sector, building a comprehensive ecosystem: from training and infrastructure support for educational centres to employment, internships and the advancement of specialists to the international level. The launch of the Bilgi.uz platform, employment programmes and the Pearson VUE certification centre enabled the scaling up of access to IT education and the creation of a steady stream of qualified personnel.",
      "Having reached a level where the ecosystem began to influence not only the training of specialists but also the development of the market as a whole, the organisation was transformed into IT Park Capital. This was a major step in transitioning from an educational model to comprehensive support for the sector — focused on financing, IT company growth, job creation, and developing export potential.",
    ],
    missionTitle: "Our mission",
    mission: "IT Park Capital's primary mission is to create a sustainable ecosystem for the growth and scaling of IT companies, thereby contributing to the development of the country's digital economy. We aim to provide entrepreneurs with access to financial instruments, expert support and opportunities to enter international markets, thereby fostering a favourable environment for innovation, technological progress and the creation of new jobs for young people.",
    timeline: [
      {
        year: "2021",
        title: "Foundation of the organisation",
        body: "Established under Cabinet of Ministers Resolution №556 of 31 August 2021 as IT Bilim — the Centre for the Development of IT Knowledge.",
      },
      {
        year: "2022–2024",
        title: "Building the ecosystem",
        body: "Launched the Bilgi.uz platform and opened the Pearson VUE certification centre. Partnered with 100+ training centres and rolled out employment programmes.",
      },
      {
        year: "2025",
        title: "Transformation into IT Park Capital",
        body: "In September the organisation was transformed into IT Park Capital — expanding scope to financing, M&A advisory, and government programmes.",
      },
    ],
  },
};
