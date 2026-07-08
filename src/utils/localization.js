export const getLocalizedField = (obj, fieldName, language) => {
  if (!obj) return "";
  const suffix = language === "en" ? "En" : "Ta";
  const localizedKey = `${fieldName}${suffix}`;
  if (obj[localizedKey] !== undefined && obj[localizedKey] !== null && obj[localizedKey] !== "") {
    return obj[localizedKey];
  }
  const otherSuffix = language === "en" ? "Ta" : "En";
  return obj[fieldName] ?? obj[`${fieldName}${otherSuffix}`] ?? "";
};

export const DIRECTION_ORDER = [
  "north", "northeast", "east", "southeast",
  "south", "southwest", "west", "northwest",
];

export const sortByDirection = (places) => {
  return [...places].sort((a, b) => {
    const dirA = (a.direction || "").toLowerCase().trim();
    const dirB = (b.direction || "").toLowerCase().trim();
    const idxA = DIRECTION_ORDER.indexOf(dirA);
    const idxB = DIRECTION_ORDER.indexOf(dirB);
    const safeA = idxA === -1 ? DIRECTION_ORDER.length : idxA;
    const safeB = idxB === -1 ? DIRECTION_ORDER.length : idxB;
    return safeA - safeB;
  });
};

export const DIRECTION_LABELS = {
  north:     { ta: "வடக்கு",       en: "North" },
  northeast: { ta: "வடகிழக்கு",    en: "North East" },
  east:      { ta: "கிழக்கு",      en: "East" },
  southeast: { ta: "தென்கிழக்கு",  en: "South East" },
  south:     { ta: "தெற்கு",       en: "South" },
  southwest: { ta: "தென்மேற்கு",   en: "South West" },
  west:      { ta: "மேற்கு",       en: "West" },
  northwest: { ta: "வடமேற்கு",     en: "North West" },
};

const uiText = {
  tourismTitle:      { ta: "சுற்றுலா இடங்கள்",              en: "Tourist Places" },
  noPlaces:          { ta: "இடங்கள் எதுவும் இல்லை",          en: "No places found" },
  checkLater:        { ta: "பின்னர் மீண்டும் பார்க்கவும்",     en: "Please check back later" },
  searchPlaceholder: { ta: "இடங்களை தேடுங்கள்...",           en: "Search places..." },
  description:       { ta: "விளக்கம்",                       en: "Description" },
  gallery:           { ta: "படத்தொகுப்பு",                   en: "Gallery" },
  video:             { ta: "வீடியோ",                          en: "Video" },
  readMore:          { ta: "மேலும் படிக்க",                   en: "Read More" },
  readLess:          { ta: "குறைவாகப் படிக்க",                en: "Read Less" },
  clickHere:         { ta: "இங்கே",                           en: "Click" },
  moreInfo:          { ta: "மேலும் தகவலுக்கு",                en: "Here more info" },
  noData:            { ta: "தரவு இல்லை",                     en: "No data found" },
};

export const t = (key, language) => uiText[key]?.[language] ?? uiText[key]?.en ?? "";