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