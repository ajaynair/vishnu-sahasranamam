
import React, { useState } from 'react';
import { LanguageOption } from './types';
import { CONTENT_LANGUAGES } from './constants';

const SPECIFIC_ENGLISH_HEADERS = new Set([
  "Pūrva Pīṭhikā",
  "Srī Vaiśampāyana Uvācha",
  "Yudhiṣṭhira Uvācha",
  "Srī Bhīṣma Uvācha",
  "Pūrvanyāsaḥ",
  "Karanyāsaḥ",
  "Aṅganyāsaḥ",
  "Pañchapūja",
  "Dhyānam", // Added Dhyānam as it's a common specific header
  "Uttara pīṭhikā",
  "phalaśrutiḥ",
  "Arjuna Uvācha",
  "Srī Bhagavān Uvācha",
  "Vyāsa Uvācha",
  "Pārvati Uvācha",
  "Iśvara Uvācha",
  "Brahmōvācha",
  "Sañjaya Uvācha"
]);

const App: React.FC = () => {
  const englishLang = CONTENT_LANGUAGES.find(lang => lang.id === 'english') || CONTENT_LANGUAGES[0];
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>(englishLang);

  const handleLanguageChange = (language: LanguageOption) => {
    setSelectedLanguage(language);
  };

  const getLineEndingType = (lineStr: string): 'stanzaEnd' | 'halfVerseEnd' | 'verseEnd' | 'none' => {
    const trimmed = lineStr.trim();
    // Matches: ॥ फॉललोड बाय स्पेस (0 ऑर मोर) फॉललोड बाय डिजिट्स फॉललोड बाय स्पेस (0 ऑर मोर) फॉललोड बाय ॥
    if (trimmed.match(/॥\s*\d+\s*॥$/)) return 'stanzaEnd';
    // Matches: । अट थे एन्ड ऑफ थे स्ट्रिंग
    if (trimmed.endsWith('।')) return 'halfVerseEnd';
    // Matches: ॥ अट थे एन्ड ऑफ थे स्ट्रिंग
    if (trimmed.endsWith('॥')) return 'verseEnd';
    return 'none';
  };

  const renderContent = () => {
    if (selectedLanguage.id !== 'english') {
      return selectedLanguage.contentText;
    }

    const lines = selectedLanguage.contentText.split('\n');
    return lines.map((line, index) => {
      const trimmedLine = line.trim();

      let isDesignatedHeading = false;
      let headingDisplayLine = trimmedLine;

      if (SPECIFIC_ENGLISH_HEADERS.has(trimmedLine)) {
        isDesignatedHeading = true;
      } else {
        const containsUnicodeLetters = /\p{L}/u.test(trimmedLine);
        if (containsUnicodeLetters) {
          const isSingleWord = !trimmedLine.includes(' ') && trimmedLine.length > 0;
          const letterCharactersOnly = trimmedLine.replace(/[^\p{L}\s'-]/gu, ''); // Keep apostrophes and hyphens within words
          const allLettersAreUppercase = letterCharactersOnly.length > 0 && letterCharactersOnly.split(/\s+/).every(word => word === word.toUpperCase());


          if (isSingleWord) {
            isDesignatedHeading = true;
            headingDisplayLine = trimmedLine.toUpperCase();
          } else if (allLettersAreUppercase && letterCharactersOnly.length > 0) {
            isDesignatedHeading = true;
            // For multi-word all-caps, keep original casing if it's already all caps.
            // headingDisplayLine is already trimmedLine
          }
        }
      }

      if (isDesignatedHeading) {
        if (headingDisplayLine === "") return null;
        return (
          <p key={index} className="mt-4 mb-3 font-bold text-orange-800">
            {headingDisplayLine}
          </p>
        );
      }

      const currentLineType = getLineEndingType(trimmedLine);
      const prevLine = lines[index - 1] ? lines[index - 1].trim() : '';
      const nextLine = lines[index + 1] ? lines[index + 1].trim() : '';

      const prevLineType = getLineEndingType(prevLine);
      const nextLineType = getLineEndingType(nextLine);
      
      let classNames: string[] = ['leading-relaxed'];


      if (currentLineType === 'stanzaEnd') { // Ends with ॥ <number> ॥
        classNames.push('mb-4');
        if (prevLineType !== 'halfVerseEnd') {
          classNames.push('mt-3');
        }
      } else if (currentLineType === 'halfVerseEnd') { // Ends with ।
        classNames.push('mt-2');
        if (nextLineType !== 'stanzaEnd' && nextLineType !== 'verseEnd') { // Add bottom margin if not followed by a full verse end
          classNames.push('mb-2');
        }
      } else if (currentLineType === 'verseEnd') { // Ends with ॥ (no number)
        classNames.push('mb-3');
        if (prevLineType !== 'halfVerseEnd') {
             // Check if previous line was an actual content line and not a heading or empty
            let prevWasActualContentLineNotHeading = false;
            if (index > 0) {
                const prevOriginalLineTrimmed = lines[index-1].trim();
                if (prevOriginalLineTrimmed !== "" && !SPECIFIC_ENGLISH_HEADERS.has(prevOriginalLineTrimmed)) {
                    const prevContainsLetters = /\p{L}/u.test(prevOriginalLineTrimmed);
                    let prevWasDesignatedHeadingByRule = false;
                    if(prevContainsLetters) {
                        const prevIsSingleWord = !prevOriginalLineTrimmed.includes(' ') && prevOriginalLineTrimmed.length > 0;
                        const prevLetterCharsOnly = prevOriginalLineTrimmed.replace(/[^\p{L}\s'-]/gu, '');
                        const prevIsAllUpper = prevLetterCharsOnly.length > 0 && prevLetterCharsOnly.split(/\s+/).every(word => word === word.toUpperCase());
                        if(prevIsSingleWord || (prevIsAllUpper && prevLetterCharsOnly.length > 0)) {
                            prevWasDesignatedHeadingByRule = true;
                        }
                    }
                    if (!prevWasDesignatedHeadingByRule) {
                        prevWasActualContentLineNotHeading = true;
                    }
                }
            }
            if (prevWasActualContentLineNotHeading || index === 0) {
              classNames.push('mt-2');
            }
        }
      }


      if (trimmedLine === "" && classNames.length <= 1) { // only "leading-relaxed"
        return <p key={index} className="h-4"></p>; // Render a small gap for intentional empty lines
      }
      if (trimmedLine === "") return null;


      return (
        <p key={index} className={classNames.join(' ')}>
          {line}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-100 text-gray-800">
      {/* Sidebar for Language Selection */}
      <aside className="w-full md:w-60 lg:w-72 p-3 md:p-5 bg-orange-50/70 shadow-md md:min-h-screen md:sticky md:top-0 md:overflow-y-auto order-1 md:order-1">
        <h2 className="text-xl md:text-2xl font-semibold text-orange-700 mb-3 md:mb-5 text-center md:text-left">
          Languages
        </h2>
        <div className="flex flex-row flex-wrap md:flex-col justify-center md:justify-start gap-2 md:gap-2.5">
          {CONTENT_LANGUAGES.map((language) => (
            <button
              key={language.id}
              onClick={() => handleLanguageChange(language)}
              aria-pressed={selectedLanguage.id === language.id}
              className={`
                py-2 px-3 md:py-2.5 md:px-4 rounded-md shadow-sm transition-all duration-300 ease-in-out font-medium
                md:w-full md:text-left text-xs sm:text-sm md:text-base 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 focus:ring-offset-orange-50
                ${
                  selectedLanguage.id === language.id
                    ? 'bg-orange-600 text-white ring-2 ring-orange-500 transform md:scale-[1.02]'
                    : 'bg-white text-orange-700 hover:bg-orange-100 hover:shadow-md'
                }
              `}
            >
              {language.displayName}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center py-5 md:py-8 px-3 sm:px-4 lg:px-6 order-2 md:order-2">
        <header className="mb-5 md:mb-8 text-center w-full max-w-5xl">
          <img src="https://mir-s3-cdn-cf.behance.net/projects/404/0e2c1c135159097.Y3JvcCwyMTYwLDE2ODksMCwxMzM.jpg" alt="Image of Lord Vishnu" className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-3 md:mb-4 rounded-full shadow-lg border-2 border-orange-300 object-cover" />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-orange-700">
            Vishnu Sahasranamam
          </h1>
          <p className="text-md sm:text-lg text-gray-600 mt-1 md:mt-2">The Thousand Names of Vishnu</p>
        </header>

        <main className="w-full max-w-5xl bg-white/90 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-xl shadow-xl">
          {/* The H3 displaying selectedLanguage.displayName has been removed */}
          <div
            className="text-lg sm:text-xl leading-relaxed whitespace-pre-wrap text-gray-700 text-left font-serif max-h-[65vh] md:max-h-[calc(100vh-280px)] overflow-y-auto p-1 md:p-2"
            aria-live="polite"
            role="region"
            aria-label={`Vishnu Sahasranamam in ${selectedLanguage.name}`}
          >
            {renderContent()}
          </div>
        </main>

        <footer className="mt-6 md:mt-10 text-center text-gray-500 text-xs sm:text-sm w-full max-w-5xl">
          <p>&copy; {new Date().getFullYear()} Vishnu Sahasranamam Multilingual Viewer. All Rights Reserved.</p>
          <p className="mt-1">A devotional offering to explore the sacred hymn.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
