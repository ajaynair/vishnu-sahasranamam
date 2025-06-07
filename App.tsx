
import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
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
  "Dhyānam",
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
  const contentRef = useRef<HTMLDivElement>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const isSeekingRef = useRef(isSeeking); // Ref to hold the latest isSeeking value

  useEffect(() => {
    isSeekingRef.current = isSeeking; // Keep ref in sync with state
  }, [isSeeking]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [selectedLanguage]);

  const formatTime = (timeInSeconds: number): string => {
    if (isNaN(timeInSeconds) || timeInSeconds === Infinity) {
      return "0:00";
    }
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const setAudioData = () => {
        if (audio.duration !== Infinity && !isNaN(audio.duration)) {
          setDuration(audio.duration);
        }
      };

      const setAudioTime = () => {
        if (!isSeekingRef.current) { // Use ref here
          setCurrentTime(audio.currentTime);
        }
      };

      const handleAudioEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        if (audioRef.current) audioRef.current.currentTime = 0;
      };

      audio.addEventListener('loadedmetadata', setAudioData);
      audio.addEventListener('timeupdate', setAudioTime);
      audio.addEventListener('ended', handleAudioEnded);
      audio.addEventListener('canplaythrough', setAudioData);


      if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) {
        setAudioData();
      }

      return () => {
        audio.removeEventListener('loadedmetadata', setAudioData);
        audio.removeEventListener('timeupdate', setAudioTime);
        audio.removeEventListener('ended', handleAudioEnded);
        audio.removeEventListener('canplaythrough', setAudioData);
      };
    }
  }, []); // Empty dependency array is now safe due to isSeekingRef


  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch(error => console.error("Error playing audio:", error));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgressChange = (event: ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
      const newTime = parseFloat(event.target.value);
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleMouseDownOnProgress = () => {
    setIsSeeking(true);
  };

  const handleMouseUpOnProgress = (event: React.MouseEvent<HTMLInputElement>) => {
    setIsSeeking(false);
    const audio = audioRef.current;
    if (audio) {
      const newTime = parseFloat((event.target as HTMLInputElement).value);
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };


  const handleLanguageChange = (language: LanguageOption) => {
    setSelectedLanguage(language);
  };

  const getLineEndingType = (lineStr: string): 'stanzaEnd' | 'halfVerseEnd' | 'verseEnd' | 'none' => {
    const trimmed = lineStr.trim();
    if (trimmed.match(/॥\s*\d+\s*॥$/)) return 'stanzaEnd';
    if (trimmed.endsWith('।')) return 'halfVerseEnd';
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
          const letterCharactersOnly = trimmedLine.replace(/[^\p{L}\s'-]/gu, '');
          const allLettersAreUppercase = letterCharactersOnly.length > 0 && letterCharactersOnly.split(/\s+/).every(word => word === word.toUpperCase());

          if (isSingleWord) {
            isDesignatedHeading = true;
            headingDisplayLine = trimmedLine.toUpperCase();
          } else if (allLettersAreUppercase && letterCharactersOnly.length > 0) {
            isDesignatedHeading = true;
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

      if (currentLineType === 'stanzaEnd') {
        classNames.push('mb-4');
        if (prevLineType !== 'halfVerseEnd') {
          classNames.push('mt-3');
        }
      } else if (currentLineType === 'halfVerseEnd') {
        classNames.push('mt-2');
        if (nextLineType !== 'stanzaEnd' && nextLineType !== 'verseEnd') {
          classNames.push('mb-2');
        }
      } else if (currentLineType === 'verseEnd') {
        classNames.push('mb-3');
        if (prevLineType !== 'halfVerseEnd') {
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

      if (trimmedLine === "" && classNames.length <= 1) {
        return <p key={index} className="h-4"></p>;
      }
      if (trimmedLine === "") return null;

      return (
          <p key={index} className={classNames.join(' ')}>
            {line}
          </p>
      );
    });
  };

  const audioPlayerControls = (
      <div className="mt-1 mb-3 p-3 bg-orange-50/80 rounded-lg shadow-md flex items-center space-x-2 sm:space-x-3">
        <audio ref={audioRef} src="/vishnu-sahasranamam/vishnu-sahasranamam.mp3" preload="metadata" />
        <button
            onClick={togglePlayPause}
            className="p-2 rounded-full bg-orange-600 text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-orange-100 transition-colors duration-150"
            aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
            aria-pressed={isPlaying}
        >
          {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0a.75.75 0 0 1 .75-.75H16.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
              </svg>
          ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
              </svg>
          )}
        </button>
        <span className="text-xs sm:text-sm text-gray-700 w-10 sm:w-12 text-center">{formatTime(currentTime)}</span>
        <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleProgressChange}
            onMouseDown={handleMouseDownOnProgress}
            onMouseUp={handleMouseUpOnProgress}
            className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            aria-label="Audio progress"
        />
        <span className="text-xs sm:text-sm text-gray-700 w-10 sm:w-12 text-center">{formatTime(duration)}</span>
      </div>
  );


  return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-100 text-gray-800">
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

        <div className="flex-1 flex flex-col items-center py-5 md:py-8 px-3 sm:px-4 lg:px-6 order-2 md:order-2">
          <header className="mb-5 md:mb-8 text-center w-full max-w-5xl">
            <img src="https://mir-s3-cdn-cf.behance.net/projects/404/0e2c1c135159097.Y3JvcCwyMTYwLDE2ODksMCwxMzM.jpg" alt="Image of Lord Vishnu" className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-3 md:mb-4 rounded-full shadow-lg border-2 border-orange-300 object-cover" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-orange-700">
              Vishnu Sahasranamam
            </h1>
            <p className="text-md sm:text-lg text-gray-600 mt-1 md:mt-2">The Thousand Names of Vishnu</p>
          </header>

          <main className="w-full max-w-5xl bg-white/90 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-xl shadow-xl">
            {audioPlayerControls}
            <div
                ref={contentRef}
                className="text-xl sm:text-2xl leading-relaxed whitespace-pre-wrap text-gray-700 text-center font-serif max-h-[60vh] md:max-h-[calc(100vh-350px)] overflow-y-auto p-1 md:p-2" // Adjusted max-h for audio player
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
