import type { Locale } from '~/i18n';

export type NewsCategory = 'company' | 'programs' | 'events' | 'partnerships';

type LocalizedNews = {
  title: string;
  summary: string;
};

export type NewsItem = {
  slug: string;
  date: string;
  category: NewsCategory;
  content: Record<Locale, LocalizedNews>;
};

export const NEWS: NewsItem[] = [
  {
    slug: 'online-meeting-residents',
    date: '2026-05-15',
    category: 'programs',
    content: {
      uz: {
        title: "IT Park rezidentlari uchun onlayn uchrashuv bo'lib o'tdi",
        summary:
          "Tadbirga mamlakatning barcha hududlaridan IT-kompaniyalar, o'quv markazlari va IT-xizmatlar eksportchilari vakillari ulandi. Mutaxassislar maqsadli qarz dasturlari va joriy taklif shartlarini batafsil taqdim etdi.",
      },
      ru: {
        title: "Состоялась онлайн-встреча для резидентов IT Park",
        summary:
          "К мероприятию подключились представители IT-компаний, учебных центров и экспортёров IT-услуг со всех регионов страны. Специалисты представили программы целевых займов и текущие условия финансирования.",
      },
      en: {
        title: "Online meeting held for IT Park residents",
        summary:
          "Representatives from IT companies, training centres and IT service exporters from across the country joined the conference. Specialists presented targeted loan programmes and explained the current financing offering.",
      },
    },
  },
  {
    slug: 'plug-and-play-expo-2026',
    date: '2026-04-28',
    category: 'events',
    content: {
      uz: {
        title: "Plug and Play Uzbekistan Expo 2026 bo'lib o'tdi",
        summary:
          "Tadbir Markaziy Osiyoning texnologik startap sohasidagi muhim voqealaridan biriga aylandi — startaplar, investorlar va texnologiya sohasi vakillarini bir tomga jamladi. IT Park Capital jamoasi tadbirda faol ishtirok etdi.",
      },
      ru: {
        title: "Plug and Play Uzbekistan Expo 2026",
        summary:
          "Мероприятие стало одним из ключевых событий Центральной Азии в сфере технологических стартапов, объединив стартапы, инвесторов и представителей IT-индустрии под одной крышей. Команда IT Park Capital приняла участие в экспо.",
      },
      en: {
        title: "Plug and Play Uzbekistan Expo 2026 was held",
        summary:
          "The event has become one of Central Asia's key technology start-up events, bringing together start-ups, investors and representatives of the technology industry under one roof. The IT Park Capital team took part in the expo.",
      },
    },
  },
  {
    slug: 'cevf-2026-speaker',
    date: '2026-04-12',
    category: 'events',
    content: {
      uz: {
        title: "IT Park Capital bosh direktori Jahongir Kagirov — CEVF 2026 spikeri",
        summary:
          "Bosh direktor Central Eurasian Venture Forum doirasidagi «Access to Finance in Central Eurasia» paneli ishtirokchisi sifatida texnologik kompaniyalar va startaplarni moliyalashtirish bo'yicha tajriba bilan o'rtoqlashdi.",
      },
      ru: {
        title: "Директор IT Park Capital Джахонгир Кагиров — спикер CEVF 2026",
        summary:
          "Генеральный директор выступил в качестве участника панели «Access to Finance in Central Eurasia» на Central Eurasian Venture Forum 2026, поделившись опытом финансирования технологических компаний и стартапов.",
      },
      en: {
        title: "IT Park Capital CEO Jahongir Kagirov — speaker at CEVF 2026",
        summary:
          "The CEO served as a panellist on the \"Access to Finance in Central Eurasia\" discussion at the Central Eurasian Venture Forum 2026, sharing expertise on financing technology companies and start-ups.",
      },
    },
  },
  {
    slug: 'termez-it-export-meeting',
    date: '2026-03-25',
    category: 'events',
    content: {
      uz: {
        title: "Hududlardan IT-eksport: Termizda kompaniyalar uchun xalqaro imkoniyatlar muhokama qilindi",
        summary:
          "Uchrashuvda jamoani kengaytirish, infratuzilmani rivojlantirish, texnologiyalarni moliyalashtirish va yangi xorijiy bozorlarga chiqish masalalari ko'rib chiqildi. Ishtirokchilar eksport maqsadli qarz vositalariga alohida qiziqish bildirishdi.",
      },
      ru: {
        title: "IT-экспорт из регионов: в Термезе обсудили международные возможности для компаний",
        summary:
          "Встреча была посвящена расширению команды, развитию инфраструктуры, финансированию технологий и выходу на новые зарубежные рынки. Участники проявили интерес к инструментам целевых экспортных займов.",
      },
      en: {
        title: "IT exports from the regions: international opportunities discussed in Termez",
        summary:
          "The meeting covered expanding teams, developing infrastructure, financing technology and entering new foreign markets. Participants showed strong interest in export-focused targeted loan instruments.",
      },
    },
  },
  {
    slug: 'karshi-residents-meeting',
    date: '2026-03-08',
    category: 'events',
    content: {
      uz: {
        title: "Qarshi shahrida IT Park rezident-eksportyorlari bilan uchrashuv bo'lib o'tdi",
        summary:
          "IT Park Capital jamoasi eksportga yo'naltirilgan kompaniyalar uchun moliyaviy qo'llab-quvvatlash vositalarini taqdim etdi va Data Drive Qarshi hamda Avangard Call Solutions kabi mahalliy texnologik kompaniyalar ofislariga tashrif buyurdi.",
      },
      ru: {
        title: "В Карши прошла встреча с резидентами IT Park, осуществляющими экспорт IT-услуг",
        summary:
          "Команда IT Park Capital представила инструменты финансовой поддержки для экспортно-ориентированных компаний и посетила офисы локальных технологических компаний — Data Drive Qarshi и Avangard Call Solutions.",
      },
      en: {
        title: "Meeting with IT Park resident exporters held in Karshi",
        summary:
          "The IT Park Capital team presented financial support tools for export-focused companies and visited the offices of local technology firms including Data Drive Qarshi and Avangard Call Solutions.",
      },
    },
  },
  {
    slug: 'samarkand-easy-booking',
    date: '2026-02-18',
    category: 'partnerships',
    content: {
      uz: {
        title: "Samarqand viloyatida IT Park Capitalning hududiy dasturi doirasida navbatdagi uchrashuv bo'lib o'tdi",
        summary:
          "Easy Booking sayyohlik biznesi vakillari bilan muzokaralar olib borildi. Taqdimotda IT Park Capital xizmatlari, ayniqsa xalqaro hamkorlik uchun moliyaviy to'siqlarni kamaytirishga qaratilgan Zero Risk dasturi yoritildi.",
      },
      ru: {
        title: "В Самарканде состоялась очередная встреча в рамках региональной программы IT Park Capital",
        summary:
          "Прошли переговоры с представителями туристического бизнеса Easy Booking. В презентации были подробно рассмотрены услуги IT Park Capital, в особенности программа Zero Risk, направленная на снижение финансовых барьеров для международного сотрудничества.",
      },
      en: {
        title: "Next meeting under IT Park Capital's regional programme held in Samarkand",
        summary:
          "Negotiations were held with representatives of the Easy Booking tourism business. The presentation covered IT Park Capital's services in detail, with particular emphasis on the Zero Risk programme designed to reduce financial barriers for international cooperation.",
      },
    },
  },
];

export function newsOrdered(): NewsItem[] {
  return [...NEWS].sort((a, b) => (a.date < b.date ? 1 : -1));
}
