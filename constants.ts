import { LanguageOption } from './types';
import { devanagariContentText } from './lang-data/devanagari.data';
import { bengaliContentText } from './lang-data/bengali.data';
import { englishContentText } from './lang-data/english.data';
import { tamilContentText } from './lang-data/tamil.data';
import { teluguContentText } from './lang-data/telugu.data';
import { gujaratiContentText } from './lang-data/gujarati.data';
import { malayalamContentText } from './lang-data/malayalam.data';
import { kannadaContentText } from './lang-data/kannada.data.ts';
import { odiaContentText } from './lang-data/odia.data';
import { assameseContentText } from './lang-data/assamese.data';
import { punjabiContentText } from './lang-data/punjabi.data';
import { sinhalaContentText } from './lang-data/sinhala.data';
import { granthaContentText } from './lang-data/grantha.data';


export const CONTENT_LANGUAGES: LanguageOption[] = [
  {
    id: 'english',
    name: 'English',
    displayName: 'English',
    contentText: englishContentText
  },
  {
    id: 'malayalam',
    name: 'Malayalam',
    displayName: 'മലയാളം (Malayalam)',
    contentText: malayalamContentText
  },
  {
    id: 'devanagari',
    name: 'Devanagari',
    displayName: 'देवनागरी (Devanagari)',
    contentText: devanagariContentText
  },
  {
    id: 'bengali',
    name: 'Bengali',
    displayName: 'বাংলা (Bengali)',
    contentText: bengaliContentText
  },
  {
    id: 'tamil',
    name: 'Tamil',
    displayName: 'தமிழ் (Tamil)',
    contentText: tamilContentText
  },
  {
    id: 'telugu',
    name: 'Telugu',
    displayName: 'తెలుగు (Telugu)',
    contentText: teluguContentText
  },
  {
    id: 'gujarati',
    name: 'Gujarati',
    displayName: 'ગુજરાતી (Gujarati)',
    contentText: gujaratiContentText
  },
  {
    id: 'kannada',
    name: 'Kannada',
    displayName: 'ಕನ್ನಡ (Kannada)',
    contentText: kannadaContentText
  },
  {
    id: 'odia',
    name: 'Odia',
    displayName: 'ଓଡ଼ିଆ (Odia)',
    contentText: odiaContentText
  },
  {
    id: 'assamese',
    name: 'Assamese',
    displayName: 'অসমীয়া (Assamese)',
    contentText: assameseContentText
  },
  {
    id: 'punjabi',
    name: 'Punjabi',
    displayName: 'ਪੰਜਾਬੀ (Punjabi)',
    contentText: punjabiContentText
  },
  {
    id: 'sinhala',
    name: 'Sinhala',
    displayName: 'සිංහල (Sinhala)',
    contentText: sinhalaContentText
  },
  {
    id: 'grantha',
    name: 'Grantha',
    displayName: 'Grantha (Grantha Script)',
    contentText: granthaContentText
  }
];

export interface UITranslationStrings {
  selectLanguageTitle: string;
  closeLanguageSelection: string;
  audioPlayerTitle: string;
  closeAudioPlayer: string;
  playAudio: string;
  pauseAudio: string;
  seekBackward: string;
  seekForward: string;
  audioProgress: string;
  speedLabel: string;
  aboutAppTitle: string;
  closeAboutApp: string;
  settings: string;
  hideSettings: string;
  changeLanguage: string;
  audioControlsBase: string;
  audioStatusPlaying: string;
  audioStatusPaused: string;
  textSizeLabel: string;
  decreaseTextSize: string;
  increaseTextSize: string;
  adjustTextSize: string;
  aboutThisApp: string;
  copyrightText: string;
  scrollToTop: string;
}

export interface LanguageUITranslations {
  [languageId: string]: UITranslationStrings;
}

export const UI_TRANSLATIONS: LanguageUITranslations = {
  english: {
    selectLanguageTitle: "Select Language",
    closeLanguageSelection: "Close language selection",
    audioPlayerTitle: "Audio Player",
    closeAudioPlayer: "Close audio player",
    playAudio: "Play audio",
    pauseAudio: "Pause audio",
    seekBackward: "Seek backward 10 seconds",
    seekForward: "Seek forward 10 seconds",
    audioProgress: "Audio progress",
    speedLabel: "Speed:",
    aboutAppTitle: "About This App",
    closeAboutApp: "Close about this app",
    settings: "Settings",
    hideSettings: "Hide Settings",
    changeLanguage: "Change Language",
    audioControlsBase: "Vishnu Sahasranamam Audio",
    audioStatusPlaying: " (Playing)",
    audioStatusPaused: " (Paused)",
    textSizeLabel: "Text Size:",
    decreaseTextSize: "Decrease text size",
    increaseTextSize: "Increase text size",
    adjustTextSize: "Adjust text size",
    aboutThisApp: "About This App",
    copyrightText: "© {YEAR} Vishnu Sahasranamam Multilingual Viewer. All Rights Reserved.",
    scrollToTop: "Scroll to Top",
  },
  malayalam: {
    selectLanguageTitle: "ഭാഷ തിരഞ്ഞെടുക്കുക",
    closeLanguageSelection: "ഭാഷാ തിരഞ്ഞെടുപ്പ് അടയ്ക്കുക",
    audioPlayerTitle: "ഓഡിയോ പ്ലെയർ",
    closeAudioPlayer: "ഓഡിയോ പ്ലെയർ അടയ്ക്കുക",
    playAudio: "ഓഡിയോ പ്ലേ ചെയ്യുക",
    pauseAudio: "ഓഡിയോ താൽക്കാലികമായി നിർത്തുക",
    seekBackward: "10 സെക്കൻഡ് പിന്നോട്ട് പോകുക",
    seekForward: "10 സെക്കൻഡ് മുന്നോട്ട് പോകുക",
    audioProgress: "ഓഡിയോ പുരോഗതി",
    speedLabel: "വേഗത:",
    aboutAppTitle: "ഈ ആപ്പിനെക്കുറിച്ച്",
    closeAboutApp: "ഈ ആപ്പിനെക്കുറിച്ചുള്ള വിവരണം അടയ്ക്കുക",
    settings: "ക്രമീകരണങ്ങൾ",
    hideSettings: "ക്രമീകരണങ്ങൾ മറയ്ക്കുക",
    changeLanguage: "ഭാഷ മാറ്റുക",
    audioControlsBase: "വിഷ്ണു സഹസ്രനാമ ഓഡിയോ",
    audioStatusPlaying: " (പ്ലേ ചെയ്യുന്നു)",
    audioStatusPaused: " (താൽക്കാലികമായി നിർത്തി)",
    textSizeLabel: "അക്ഷര വലുപ്പം:",
    decreaseTextSize: "അക്ഷര വലുപ്പം കുറയ്ക്കുക",
    increaseTextSize: "അക്ഷര വലുപ്പം കൂട്ടുക",
    adjustTextSize: "അക്ഷര വലുപ്പം ക്രമീകരിക്കുക",
    aboutThisApp: "ഈ ആപ്പിനെക്കുറിച്ച്",
    copyrightText: "© {YEAR} വിഷ്ണു സഹസ്രനാമ ബഹുഭാഷാ ദർശിനി. എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം.",
    scrollToTop: "മുകളിലേക്ക് പോകുക",
  }
  // Add other languages here, e.g., devanagari, tamil, etc.
  // For example, a partial Devanagari translation:
  // devanagari: {
  //   selectLanguageTitle: "भाषा चुनें",
  //   changeLanguage: "भाषा बदलें",
  //   ... (other strings)
  // }
};

// Function to get translations for a language, falling back to English if a string is missing
export const getUITranslations = (languageId: string): UITranslationStrings => {
  const defaultStrings = UI_TRANSLATIONS.english;
  const selectedLangStrings = UI_TRANSLATIONS[languageId] || defaultStrings;
  return { ...defaultStrings, ...selectedLangStrings }; // Merge to ensure all keys exist
};
