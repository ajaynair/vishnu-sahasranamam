import { LanguageOption } from './types';
import { sanskritContentText } from './lang-data/sanskrit.data';
import { hindiContentText } from './lang-data/hindi.data';
import { bengaliContentText } from './lang-data/bengali.data';
import { englishContentText } from './lang-data/english.data';
import { tamilContentText } from './lang-data/tamil.data';
import { teluguContentText } from './lang-data/telugu.data';
import { marathiContentText } from './lang-data/marathi.data';
import { gujaratiContentText } from './lang-data/gujarati.data';
import { malayalamContentText } from './lang-data/malayalam.data';

export const CONTENT_LANGUAGES: LanguageOption[] = [
  {
    id: 'sanskrit',
    name: 'Sanskrit',
    displayName: 'संस्कृतम् (Sanskrit)',
    contentText: sanskritContentText
  },
  {
    id: 'hindi',
    name: 'Hindi',
    displayName: 'हिन्दी (Hindi)',
    contentText: hindiContentText
  },
  {
    id: 'bengali',
    name: 'Bengali',
    displayName: 'বাংলা (Bengali)',
    contentText: bengaliContentText
  },
  {
    id: 'english',
    name: 'English',
    displayName: 'English',
    contentText: englishContentText
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
    id: 'marathi',
    name: 'Marathi',
    displayName: 'मराठी (Marathi)',
    contentText: marathiContentText
  },
  {
    id: 'gujarati',
    name: 'Gujarati',
    displayName: 'ગુજરાતી (Gujarati)',
    contentText: gujaratiContentText
  },
  {
    id: 'malayalam',
    name: 'Malayalam',
    displayName: 'മലയാളം (Malayalam)',
    contentText: malayalamContentText
  }
];