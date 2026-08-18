export type ExpressionKey = 'open' | 'closedSoft' | 'closedHappy' | 'surprised' | 'relaxed';

export type CompanionConfig = {
  id: string;
  name: string;
  bodyImage: any;
  bodyAspectRatio: number; // body image width / height
  eyes?: Partial<Record<ExpressionKey, any>>; // optional until eyes art exists for this companion
  eyesWidthPct: number;    // eyes width as a fraction of body width
  eyesLeftPct: number;     // eyes left offset as a fraction of body width
  eyesTopPct: number;      // eyes top offset as a fraction of body height
  eyesAspectRatio: number; // eyes image width / height
};

export const COMPANIONS: Record<string, CompanionConfig> = {
  lanternKeeper: {
    id: 'lanternKeeper',
    name: 'Lantern Keeper',
    bodyImage: require('../../../assets/images/companion/lantern_keeper_body_blank.png'),
    bodyAspectRatio: 1024 / 1536,
    eyes: {
      open: require('../../../assets/images/companion/lantern_keeper_eyes_open.png'),
      closedSoft: require('../../../assets/images/companion/lantern_keeper_eyes_closed_soft.png'),
      closedHappy: require('../../../assets/images/companion/lantern_keeper_eyes_closed_happy.png'),
      surprised: require('../../../assets/images/companion/lantern_keeper_eyes_surprised.png'),
      relaxed: require('../../../assets/images/companion/lantern_keeper_eyes_relaxed.png'),
    },
    eyesWidthPct: 260 / 1024,
    eyesLeftPct: 397 / 1024,
    eyesTopPct: 310 / 1536,
    eyesAspectRatio: 620 / 465,
  },
  quietMusician: {
    id: 'quietMusician',
    name: 'Quiet Musician',
    bodyImage: require('../../../assets/images/companion/quiet_musician_body_blank.png'),
    bodyAspectRatio: 1024 / 1536,
    // no eyes yet — will render with a blank face until added
    eyesWidthPct: 260 / 1024,
    eyesLeftPct: 397 / 1024,
    eyesTopPct: 310 / 1536,
    eyesAspectRatio: 620 / 465,
  },
  wanderingChild: {
    id: 'wanderingChild',
    name: 'Wandering Child',
    bodyImage: require('../../../assets/images/companion/wandering_child_body_blank.png'),
    bodyAspectRatio: 1024 / 1536,
    eyesWidthPct: 260 / 1024,
    eyesLeftPct: 397 / 1024,
    eyesTopPct: 310 / 1536,
    eyesAspectRatio: 620 / 465,
  },
  foxScholar: {
    id: 'foxScholar',
    name: 'Fox-Spirit Scholar',
    bodyImage: require('../../../assets/images/companion/fox_scholar_body_blank.png'),
    bodyAspectRatio: 1024 / 1536,
    eyesWidthPct: 260 / 1024,
    eyesLeftPct: 397 / 1024,
    eyesTopPct: 310 / 1536,
    eyesAspectRatio: 620 / 465,
  },
  featherCollector: {
    id: 'featherCollector',
    name: 'Feather Collector',
    bodyImage: require('../../../assets/images/companion/feather_collector_body_blank.png'),
    bodyAspectRatio: 1024 / 1536,
    eyesWidthPct: 260 / 1024,
    eyesLeftPct: 397 / 1024,
    eyesTopPct: 310 / 1536,
    eyesAspectRatio: 620 / 465,
  },
};

// Given a target rendered width for a companion, works out the real
// pixel sizes/positions for the body and the eyes overlay. Used by
// every screen that shows a companion, so the math only lives here.
export function getCompanionLayout(config: CompanionConfig, width: number) {
  const height = width / config.bodyAspectRatio;
  const eyesWidth = width * config.eyesWidthPct;
  const eyesLeft = width * config.eyesLeftPct;
  const eyesTop = height * config.eyesTopPct;
  const eyesHeight = eyesWidth / config.eyesAspectRatio;
  return { width, height, eyesWidth, eyesLeft, eyesTop, eyesHeight };
}