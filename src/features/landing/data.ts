export type MockImage = { bg: string; emoji: string };

const img = (bg: string, emoji: string): MockImage => ({ bg, emoji });

export const heroImages = {
  home: img('linear-gradient(135deg,#0f2416,#1e3a24,#0a0f0a)', '🏎️'),
  model: img('linear-gradient(135deg,#3a3a40,#1a1a1e,#0a0a0c)', '🚗'),
  gen: img('linear-gradient(135deg,#33343a,#17181c,#0b0b0e)', '🚙'),
};

export type LandingModel = {
  slug: string;
  name: string;
  tags: string[];
  years: string;
  image: MockImage;
};

const modelImages = [
  img('linear-gradient(135deg,#4b5563,#1f2937)', '🏎️'),
  img('linear-gradient(135deg,#14532d,#052e16)', '🚗'),
  img('linear-gradient(135deg,#e5e7eb,#9ca3af)', '🚙'),
];

export const landingModels: LandingModel[] = Array.from({ length: 12 }, (_, i) => ({
  slug: 'm4',
  name: 'BMW M4',
  tags: ['Sedan', 'M Division'],
  years: '2021 – Present',
  image: modelImages[i % 3],
}));

export const bodyTypeFilters = [
  'All',
  'Compact',
  'Convertible',
  'Coupe',
  'Roadster',
  'SAV',
  'Sedan',
  'Touring',
  'Other',
];
export const seriesFilters = ['All', 'X', '7', '5', '4', '3', '2', '1', 'Z'];
export const decadeFilters = ['All', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];

export type LandingGen = {
  slug: string;
  name: string;
  body: string;
  years: string;
  image: MockImage;
};

export const landingGens: LandingGen[] = [
  { slug: 'g82', name: 'BMW M4 Generation G82', body: 'Coupe', years: '2021 – Present', image: modelImages[0] },
  {
    slug: 'g83',
    name: 'BMW M4 Generation G83',
    body: 'Convertible',
    years: '2021 – Present',
    image: img('linear-gradient(135deg,#1e3a8a,#172554)', '🚙'),
  },
  {
    slug: 'f83-lci',
    name: 'BMW M4 Generation F83 (Restyling)',
    body: 'Convertible',
    years: '2017 – 2020',
    image: img('linear-gradient(135deg,#374151,#111827)', '🚗'),
  },
  {
    slug: 'f83',
    name: 'BMW M4 Generation F83',
    body: 'Convertible',
    years: '2014 – 2016',
    image: img('linear-gradient(135deg,#6b7280,#374151)', '🚙'),
  },
  {
    slug: 'f82-lci',
    name: 'BMW M4 Generation F82 (Restyling)',
    body: 'Coupe',
    years: '2015 – 2017',
    image: img('linear-gradient(135deg,#7f1d1d,#450a0a)', '🏎️'),
  },
  {
    slug: 'f82',
    name: 'BMW M4 Generation F82',
    body: 'Coupe',
    years: '2017 – 2020',
    image: img('linear-gradient(135deg,#a16207,#713f12)', '🚗'),
  },
];

export type OwnerLogbook = {
  name: string;
  car: string;
  meta: string;
  stats: { label: string; value: string }[];
  image: MockImage;
  url?: string;
  avatar?: string;
};

export type OwnerStory = {
  car: string;
  meta: string;
  tag?: string;
  title: string;
  text: string;
  author: string;
  reposts: number;
  comments: number;
  likes: number;
  image?: MockImage;
  images?: MockImage[];
  url?: string;
  avatar?: string;
};

export const galleryImages: MockImage[] = [
  img('linear-gradient(135deg,#7f1d1d,#450a0a)', '🏎️'),
  img('linear-gradient(135deg,#1c1917,#0c0a09)', '🚗'),
  img('linear-gradient(135deg,#334155,#0f172a)', '🚙'),
  img('linear-gradient(135deg,#3f6212,#1a2e05)', '🚕'),
];

export const techSpecs = {
  linkLabel: 'BMW M4 COMPETITION',
  sub: 'G82 (2020-2024) / COUPE',
  rows: [
    { label: 'Engine', value: 'S58B30T0 INL. INL-6 TWIN-TURBO' },
    { label: 'Production', value: '2020 – PRESENT' },
    { label: 'Body', value: '2-DOOR COUPE / CONVERTIBLE' },
    { label: 'Drive', value: 'RWD / XDRIVE (OPT.)' },
    { label: 'Transmission', value: '8-SPEED M STEPTRONIC / 6MT' },
    { label: '0 – 100 km/h', value: '3.9 S (COMPETITION)' },
    { label: 'Top speed', value: '250 KM/H (290 OPT.)' },
  ],
};

export const modelOverview = [
  'The BMW M4 is the definitive expression of M Division’s engineering philosophy — a high-performance coupe that fuses everyday usability with race-derived dynamics. Born from the legendary 4 Series, the M4 takes its architecture and rebuilds it from the ground up with a hand-assembled inline-six, purpose-tuned suspension, and a cabin that tells you exactly where your priorities lie.',
  'The last G82 generation introduced a polarising but purposeful wide-body stance, housing the twin-turbocharged S58 engine — a unit developed specifically for M Division. With Competition trim, the S58 produces 510 hp and 650 Nm of torque, channelled through an 8-speed M Steptronic or a 6-speed manual. The optional xDrive all-wheel drive system brings supercar-tier performance to year-round driving conditions.',
  'As BMW accelerates into an electrified future with its i-series lineup, the brand’s core promise remains unchanged: every car should be a joy to drive. The shift to electric is not a compromise – it is the next evolution of the Ultimate Driving Machine.',
];

export const genOverview = [
  'The G82 generation, introduced in 2021, represents the most significant technological leap in M4 history. It is the first M4 to offer all-wheel drive (M xDrive), the first to offer a Competition variant from launch, and the first to utilise the hand-assembled S58 twin-turbocharged inline-six — an engine developed exclusively for M GmbH, producing up to 530 hp in xDrive specification.',
  'Its wide-body stance — 80 mm broader than the standard 4 Series — is not a styling exercise. It accommodates a wider front and rear track, larger brakes, and M-compound kinematics tuned for both road and circuit. The G82 is the first M4 to be offered factory-new with a 6-speed manual alongside the 8-speed M Steptronic, keeping mechanical engagement at the heart of the lineup. At the pinnacle sits the limited CSL, making 550 hp and featuring carbon bodywork, a roll cage preparation, and the most focused chassis setup ever fitted to a road M car.',
];

export const genHeroStats = [
  { label: 'Power', value: '480-510 hp' },
  { label: '0-100 km/h', value: '3.9s' },
  { label: 'Engine', value: 'BITURBO (S58)' },
];

export const modelStatsStrip = [
  { value: '6', label: 'Generations' },
  { value: 'GERMANY', label: 'Country of assembly' },
  { value: '4 256', label: 'Logbooks on motority.com' },
  { value: '56', label: 'Countries' },
];

export const genStatsStrip = [
  { value: '1 247', label: 'Logbooks on Motority' },
  { value: '4.7', label: "Motority's users rating" },
  { value: '4 256', label: 'Posts in community' },
  { value: 'SINCE 2025', label: 'On Motority' },
];

export type ModSpecGroup = { title: string; rows: { label: string; value: string }[] };

export const modSpecColumns: ModSpecGroup[][] = [
  [
    {
      title: 'General information',
      rows: [
        { label: 'Country of origin', value: 'GERMANY' },
        { label: 'Car class', value: 'A' },
        { label: 'Number of doors', value: '4' },
        { label: 'Number of seats', value: '5' },
        { label: 'Steering wheel position', value: 'LEFT' },
      ],
    },
    {
      title: 'Engine',
      rows: [
        { label: 'Engine type', value: 'GASOLINE' },
        { label: 'Engine location', value: 'FRONT, LONGITUDINAL' },
        { label: 'Engine capacity', value: '2.0' },
        { label: 'Type of supercharging', value: 'TURBOCHARGING' },
        { label: 'Maximum power', value: '190 HP • 140 KW • 5000 RPM' },
        { label: 'Maximum torque', value: '310 NM • 4600 RPM' },
        { label: 'Cylinder layout', value: 'INLINE' },
        { label: 'Number of cylinders', value: '4' },
        { label: 'Number of valves per cylinder', value: '4' },
        { label: 'Engine fuel system', value: 'DIESEL' },
        { label: 'Compression ratio', value: '11.9' },
        { label: 'Cylinder diameter and piston stroke', value: '82 × 94.6 MM' },
        { label: 'Engine code', value: 'VQ35' },
      ],
    },
  ],
  [
    {
      title: 'Dimensions',
      rows: [
        { label: 'Length', value: '5175 MM' },
        { label: 'Width', value: '1900 MM' },
        { label: 'Height', value: '1520 MM' },
        { label: 'Wheelbase', value: '3105 MM' },
        { label: 'Front track width', value: '1620 MM' },
        { label: 'Rear track width', value: '1616 MM' },
        { label: 'Wheel size', value: '225/40 R17' },
      ],
    },
    {
      title: 'Volume and mass',
      rows: [
        { label: 'Trunk capacity minimum', value: '500/1536 L' },
        { label: 'Fuel tank capacity', value: '60 L' },
        { label: 'Curb weight', value: '1790 KG' },
        { label: 'Total weight', value: '2330 KG' },
      ],
    },
    {
      title: 'Transmission',
      rows: [
        { label: 'Transmission', value: 'AUTOMATIC' },
        { label: 'Number of gears', value: '6' },
        { label: 'Drive type', value: 'RWD' },
      ],
    },
  ],
  [
    {
      title: 'Operational performance',
      rows: [
        { label: 'Maximum speed', value: '225 KM/H' },
        { label: 'Acceleration 0-100 km/h', value: '8.2 SEC' },
        { label: 'Fuel consumption city/highway/combined', value: '6.5 • 5.0 • 7.0 L/KM' },
        { label: 'Environmental class', value: 'EURO 6' },
        { label: 'CO2 emissions', value: '181 G/KM' },
      ],
    },
    {
      title: 'Suspension and brakes',
      rows: [
        { label: 'Front suspension type', value: 'INDEPENDENT, SPRING' },
        { label: 'Rear suspension type', value: 'INDEPENDENT, SPRING' },
        { label: 'Front brakes', value: 'VENTILATED DISC' },
        { label: 'Rear brakes', value: 'VENTILATED DISC' },
      ],
    },
  ],
];
