
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

const LanguageSelectionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  languages: LanguageOption[];
  currentLanguageId: string;
  onSelectLanguage: (language: LanguageOption) => void;
}> = ({ isOpen, onClose, languages, currentLanguageId, onSelectLanguage }) => {
  if (!isOpen) return null;

  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus({ preventScroll: true });
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
      <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="language-modal-title"
          onClick={onClose}
      >
        <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 id="language-modal-title" className="text-xl font-semibold text-orange-700">Select Language</h2>
            <button
                ref={closeButtonRef}
                onClick={onClose}
                className="p-2 text-gray-600 hover:text-orange-600 rounded-full hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                aria-label="Close language selection"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-2 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2">
              {languages.map((language) => (
                  <button
                      key={language.id}
                      onClick={() => onSelectLanguage(language)}
                      aria-pressed={currentLanguageId === language.id}
                      className={`
                  py-2.5 px-4 rounded-md shadow-sm transition-all duration-200 ease-in-out font-medium
                  w-full text-left text-sm
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 focus:ring-offset-white
                  ${
                          currentLanguageId === language.id
                              ? 'bg-orange-600 text-white ring-2 ring-orange-500'
                              : 'bg-gray-50 text-orange-700 hover:bg-orange-100 hover:shadow-md'
                      }
                `}
                  >
                    {language.displayName}
                  </button>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
};


const AudioPlayerModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  playbackRate: number;
  isSeeking: boolean;
  togglePlayPause: () => void;
  handlePlaybackRateChange: (rate: number) => void;
  seekAudio: (amount: number) => void;
  handleProgressChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleMouseDownOnProgress: () => void;
  handleMouseUpOnProgress: (event: React.MouseEvent<HTMLInputElement>) => void;
  formatTime: (time: number) => string;
  playbackRates: number[];
}> = ({
        isOpen, onClose, audioRef, isPlaying, duration, currentTime, playbackRate,
        togglePlayPause, handlePlaybackRateChange, seekAudio, handleProgressChange,
        handleMouseDownOnProgress, handleMouseUpOnProgress, formatTime, playbackRates
      }) => {
  if (!isOpen) return null;

  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    const firstFocusableElement = modalRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement | null;

    if (firstFocusableElement) {
      firstFocusableElement.focus({ preventScroll: true });
    } else if (closeButtonRef.current) {
      closeButtonRef.current.focus({ preventScroll: true });
    }

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
      <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="audio-player-modal-title"
          onClick={onClose}
      >
        <div
            ref={modalRef}
            className="bg-orange-50/95 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-4 border-b border-orange-200">
            <h2 id="audio-player-modal-title" className="text-xl font-semibold text-orange-700">Audio Player</h2>
            <button
                ref={closeButtonRef}
                onClick={onClose}
                className="p-2 text-gray-600 hover:text-orange-600 rounded-full hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                aria-label="Close audio player"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
            {/* Centered Play/Pause Button */}
            <div className="flex flex-col items-center">
              <button
                  onClick={togglePlayPause}
                  className="p-3 sm:p-4 rounded-full bg-orange-600 text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-orange-100 transition-colors shadow-lg"
                  aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
                  aria-pressed={isPlaying}
                  disabled={!duration && audioRef.current?.readyState === 0}
              >
                {isPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 sm:w-12 sm:h-12">
                      <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0a.75.75 0 0 1 .75-.75H16.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 sm:w-12 sm:h-12">
                      <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                    </svg>
                )}
              </button>
              <span className="block text-sm font-medium text-orange-700 mt-1">{isPlaying ? 'Pause' : 'Play'}</span>
            </div>

            {/* Seek Controls and Time Display */}
            <div className="flex items-center justify-around sm:justify-between space-x-2 sm:space-x-3">
              <button
                  onClick={() => seekAudio(-10)}
                  aria-label="Seek backward 10 seconds"
                  className="flex items-center justify-center py-2.5 px-4 bg-orange-200 text-orange-800 rounded-lg shadow-sm hover:bg-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors text-sm sm:text-md font-medium"
                  disabled={!duration}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 mr-1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                Back 10s
              </button>
              <span className="text-sm sm:text-md text-gray-700 min-w-[90px] sm:min-w-[110px] text-center tabular-nums font-medium">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
              <button
                  onClick={() => seekAudio(10)}
                  aria-label="Seek forward 10 seconds"
                  className="flex items-center justify-center py-2.5 px-4 bg-orange-200 text-orange-800 rounded-lg shadow-sm hover:bg-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors text-sm sm:text-md font-medium"
                  disabled={!duration}
              >
                Forward 10s
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 ml-1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>

            {/* Progress Bar */}
            <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleProgressChange}
                onMouseDown={handleMouseDownOnProgress}
                onMouseUp={handleMouseUpOnProgress}
                className="w-full h-3 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-600 focus:outline-none focus:ring-1 focus:ring-orange-500"
                aria-label="Audio progress"
                disabled={!duration}
            />

            {/* Speed Controls */}
            <div className="flex items-center justify-center flex-wrap gap-1.5 sm:gap-2 pt-1">
              <span className="text-base text-gray-700 mr-1.5 font-medium">Speed:</span>
              {playbackRates.map(rate => (
                  <button
                      key={rate}
                      onClick={() => handlePlaybackRateChange(rate)}
                      className={`py-1.5 px-3 text-xs sm:text-sm rounded-md transition-colors border font-medium
                  ${playbackRate === rate ? 'bg-orange-600 text-white border-orange-600 shadow-inner' : 'bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200'}`}
                      aria-pressed={playbackRate === rate}
                      disabled={!duration}
                  >
                    {rate === 1.0 ? '1x' : `${rate}x`}
                  </button>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
};

const AboutMeModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus({ preventScroll: true });
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
      <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="about-modal-title"
          onClick={onClose}
      >
        <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 id="about-modal-title" className="text-xl font-semibold text-orange-700">
              <span className="emoji" role="img" aria-label="Folded hands">🙏</span> About This App
            </h2>
            <button
                ref={closeButtonRef}
                onClick={onClose}
                className="p-2 text-gray-600 hover:text-orange-600 rounded-full hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                aria-label="Close about this app"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-6 overflow-y-auto space-y-4 text-gray-700 text-sm leading-relaxed">
            <p>
              This application was lovingly crafted by <strong>Ajay Nair</strong>.
              I wanted to create a single place for everything related to Vishnu Sahasranamam, including audio and its text in multiple Indian languages.
              A personal project, brought to life with dedication <span className="emoji" role="img" aria-label="Sparkles">✨</span> (and many cups of <span className="emoji" role="img" aria-label="Coffee">☕</span>).
            </p>
            <p>
              The mission is to provide a serene and user-friendly platform for devotees to read, listen, and immerse themselves in the Vishnu Sahasranamam, across various languages.
              May it aid in your spiritual practice and bring peace. <span className="emoji" role="img" aria-label="Lotus flower">🪷</span>
            </p>
            <p>
              If you have any feedback, encounter a bug <span className="emoji" role="img" aria-label="Bug">🐛</span>, or wish to share your thoughts,
              please feel free to reach out at: <a href="mailto:ajaynair59@gmail.com" className="text-orange-500 hover:text-orange-600 underline">ajaynair59 [at] gmail [dot] com</a>.
            </p>
            <p className="mt-2">Wishing you a blessed experience. Hari Om! <span className="emoji" role="img" aria-label="Smiling face with folded hands">😇</span></p>
          </div>
        </div>
      </div>
  );
};


const App: React.FC = () => {
  const englishLang = CONTENT_LANGUAGES.find(lang => lang.id === 'english') || CONTENT_LANGUAGES[0];
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>(englishLang);
  const sahasranamamTextRef = useRef<HTMLDivElement>(null);
  const stickyControlsRef = useRef<HTMLDivElement>(null);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [fontSize, setFontSize] = useState(1.25);
  const [areControlsVisible, setAreControlsVisible] = useState(true);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);


  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isSeeking, setIsSeeking] = useState(false);
  const isSeekingRef = useRef(isSeeking);

  useEffect(() => {
    isSeekingRef.current = isSeeking;
  }, [isSeeking]);

  useEffect(() => {
    if (sahasranamamTextRef.current && stickyControlsRef.current) {
      const headerHeight = stickyControlsRef.current.offsetHeight;
      const elementTop = sahasranamamTextRef.current.getBoundingClientRect().top + window.pageYOffset;

      const currentScrollY = window.scrollY;
      const targetScrollY = Math.max(0, elementTop - headerHeight - 20);

      const isInitialNonDefaultLanguage = selectedLanguage.id !== (CONTENT_LANGUAGES.find(lang => lang.id === 'english') || CONTENT_LANGUAGES[0]).id;
      const isTextOutOfView = sahasranamamTextRef.current.getBoundingClientRect().top < headerHeight ||
          Math.abs(currentScrollY - targetScrollY) > 5;

      if (isTextOutOfView || (isInitialNonDefaultLanguage && currentScrollY !== targetScrollY)) {
        window.scrollTo({
          top: targetScrollY,
          behavior: 'smooth'
        });
      }
    }
  }, [selectedLanguage, areControlsVisible]);


  const formatTime = (timeInSeconds: number): string => {
    if (isNaN(timeInSeconds) || timeInSeconds === Infinity || timeInSeconds < 0) {
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
        } else {
          setDuration(0);
        }
      };
      const setAudioTime = () => {
        if (!isSeekingRef.current) {
          setCurrentTime(audio.currentTime);
        }
      };
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);

      audio.addEventListener('loadedmetadata', setAudioData);
      audio.addEventListener('timeupdate', setAudioTime);
      audio.addEventListener('ended', handlePause);
      audio.addEventListener('canplaythrough', setAudioData);
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);

      audio.playbackRate = playbackRate;

      if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) {
        setAudioData();
      }

      return () => {
        audio.removeEventListener('loadedmetadata', setAudioData);
        audio.removeEventListener('timeupdate', setAudioTime);
        audio.removeEventListener('ended', handlePause);
        audio.removeEventListener('canplaythrough', setAudioData);
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
      };
    }
  }, [playbackRate]);


  const handleToggleAudioModal = () => {
    const audio = audioRef.current;
    if (!audio) return;

    setIsAudioModalOpen(!isAudioModalOpen);

    if (!isAudioModalOpen && audio.readyState === 0) {
      audio.load();
    }
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (audio.paused) {
        if(audio.currentTime >= (audio.duration || 0) - 0.1 && (audio.duration || 0) > 0) {
          audio.currentTime = 0;
        }
        audio.play().catch(error => console.error("Error playing audio:", error));
      } else {
        audio.pause();
      }
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
  };

  const seekAudio = (amount: number) => {
    const audio = audioRef.current;
    if (audio && (audio.duration || 0) > 0) {
      const newTime = Math.max(0, Math.min(audio.duration, audio.currentTime + amount));
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleProgressChange = (event: ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio && (audio.duration || 0) > 0) {
      const newTime = parseFloat(event.target.value);
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleMouseDownOnProgress = () => setIsSeeking(true);
  const handleMouseUpOnProgress = (event: React.MouseEvent<HTMLInputElement>) => {
    setIsSeeking(false);
    const audio = audioRef.current;
    if (audio && (audio.duration || 0) > 0) {
      const newTime = parseFloat((event.target as HTMLInputElement).value);
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleLanguageSelect = (language: LanguageOption) => {
    setSelectedLanguage(language);
    setIsLanguageModalOpen(false);
  };

  const handleFontSizeChange = (delta: number) => {
    setFontSize(prevSize => {
      const newSize = parseFloat((prevSize + delta).toFixed(2));
      return Math.max(0.8, Math.min(2.5, newSize));
    });
  };
  const handleFontSizeInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newSize = parseFloat(e.target.value);
    if (!isNaN(newSize)) {
      setFontSize(Math.max(0.8, Math.min(2.5, newSize)));
    }
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
      return selectedLanguage.contentText.split('\\n').map((line, index) => (
          <p key={index} className="leading-relaxed my-1">
            {line}
          </p>
      ));
    }

    const lines = selectedLanguage.contentText.split('\\n');
    return lines.map((line, index) => {
      const trimmedLine = line.trim();
      let isDesignatedHeading = false;
      let headingDisplayLine = trimmedLine;

      if (SPECIFIC_ENGLISH_HEADERS.has(trimmedLine)) {
        isDesignatedHeading = true;
      } else {
        const containsUnicodeLetters = /\p{L}/u.test(trimmedLine);
        if (containsUnicodeLetters && trimmedLine.length > 0) {
          const isSingleWord = !trimmedLine.includes(' ') && trimmedLine.length > 0;

          if (isSingleWord) {
            isDesignatedHeading = true;
            headingDisplayLine = trimmedLine.toUpperCase();
          } else {
            const letterCharactersOnly = trimmedLine.replace(/[^\p{L}\s'-]/gu, '');
            if (letterCharactersOnly.length > 0) {
              const words = letterCharactersOnly.split(/\s+/);
              const allWordsAreUppercase = words.every(word => word.length === 0 || word === word.toUpperCase());
              if (allWordsAreUppercase) {
                isDesignatedHeading = true;
              }
            }
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
                const prevIsAllUpper = prevLetterCharsOnly.length > 0 && prevLetterCharsOnly.split(/\s+/).every(word =>  word.length === 0 || word === word.toUpperCase());
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

  const playbackRates = [0.75, 1.0, 1.25, 1.5, 2.0];

  let audioModalButtonBaseText = "Vishnu Sahasranamam Audio";
  let audioModalButtonStateText = "";
  if (isPlaying) {
    audioModalButtonStateText = " (Playing)";
  } else if (currentTime > 0 && duration > 0 && currentTime < duration) {
    audioModalButtonStateText = " (Paused)";
  }


  return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-100 text-gray-800">
        <audio ref={audioRef} src="/vishnu-sahasranamam/vishnu-sahasranamam.mp3" preload="metadata" className="hidden" />

        <div className="flex-1 flex flex-col items-center py-5 md:py-8 px-3 sm:px-4 lg:px-6">
          <header className="mb-5 md:mb-8 text-center w-full max-w-5xl">
            <img src="https://mir-s3-cdn-cf.behance.net/projects/404/0e2c1c135159097.Y3JvcCwyMTYwLDE2ODksMCwxMzM.jpg" alt="Image of Lord Vishnu" className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-3 md:mb-4 rounded-full shadow-lg border-2 border-orange-300 object-cover" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-orange-700">
              Vishnu Sahasranamam
            </h1>
            <p className="text-md sm:text-lg text-gray-600 mt-1 md:mt-2">The Thousand Names of Vishnu</p>
          </header>

          <main className="w-full max-w-5xl bg-white rounded-xl shadow-xl">
            {/* Sticky Controls Panel */}
            <div ref={stickyControlsRef} className="sticky top-0 z-30 bg-orange-50/95 backdrop-blur-sm shadow-md rounded-t-xl">
              <div className="flex justify-end items-center p-2 sm:p-3 border-b border-orange-200">
                <button
                    onClick={() => setAreControlsVisible(!areControlsVisible)}
                    className="py-2 px-4 bg-orange-400 text-white rounded-lg shadow-sm hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-1 transition-colors text-sm font-medium"
                >
                  {areControlsVisible ? 'Hide Settings' : 'Settings'}
                </button>
              </div>

              {areControlsVisible && (
                  <div className="p-4 sm:p-6 space-y-5 border-t border-orange-200">
                    <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-start items-center gap-3">
                      <button
                          onClick={() => setIsLanguageModalOpen(true)}
                          className="w-full sm:w-auto py-2.5 px-5 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition-colors whitespace-nowrap text-md font-medium"
                          aria-haspopup="dialog"
                      >
                        Change Language
                      </button>
                      <button
                          onClick={handleToggleAudioModal}
                          className="w-full sm:w-auto py-2.5 px-5 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition-colors whitespace-nowrap text-md font-medium"
                          aria-haspopup="dialog"
                          aria-expanded={isAudioModalOpen}
                      >
                        {audioModalButtonBaseText}{audioModalButtonStateText}
                      </button>

                    </div>

                    {/* Text Size Controls */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                      <span className="text-lg font-medium text-gray-700 whitespace-nowrap">Text Size:</span>
                      <div className="flex items-center gap-2 flex-grow w-full sm:w-auto">
                        <button
                            onClick={() => handleFontSizeChange(-0.1)}
                            className="py-2 px-4 bg-orange-200 text-orange-800 rounded-lg shadow-sm hover:bg-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors text-lg font-semibold"
                            aria-label="Decrease text size"
                        >
                          A-
                        </button>
                        <input
                            type="range"
                            min="0.8"
                            max="2.5"
                            step="0.05"
                            value={fontSize}
                            onChange={handleFontSizeInputChange}
                            className="w-full sm:w-48 h-3 bg-orange-100 rounded-lg appearance-none cursor-pointer accent-orange-600 focus:outline-none focus:ring-1 focus:ring-orange-500"
                            aria-label="Adjust text size"
                        />
                        <button
                            onClick={() => handleFontSizeChange(0.1)}
                            className="py-2 px-4 bg-orange-200 text-orange-800 rounded-lg shadow-sm hover:bg-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors text-lg font-semibold"
                            aria-label="Increase text size"
                        >
                          A+
                        </button>
                      </div>
                    </div>
                  </div>
              )}
            </div>

            {/* Sahasranamam Text */}
            <div
                ref={sahasranamamTextRef}
                className="whitespace-pre-wrap text-gray-700 text-center font-serif p-4 sm:p-6 pt-6 sm:pt-8"
                style={{ fontSize: `${fontSize}rem` }}
                aria-live="polite"
                role="region"
                aria-label={`Vishnu Sahasranamam in ${selectedLanguage.name}`}
            >
              {renderContent()}
            </div>
          </main>

          <footer className="mt-6 md:mt-10 text-center text-gray-500 text-xs sm:text-sm w-full max-w-5xl">
            <button
                onClick={() => setIsAboutModalOpen(true)}
                className="text-orange-600 hover:text-orange-700 hover:underline focus:outline-none focus:underline mb-2"
                aria-haspopup="dialog"
            >
              About This App
            </button>
            <p>&copy; {new Date().getFullYear()} Vishnu Sahasranamam Multilingual Viewer. All Rights Reserved.</p>
          </footer>
        </div>
        <LanguageSelectionModal
            isOpen={isLanguageModalOpen}
            onClose={() => setIsLanguageModalOpen(false)}
            languages={CONTENT_LANGUAGES}
            currentLanguageId={selectedLanguage.id}
            onSelectLanguage={handleLanguageSelect}
        />
        <AudioPlayerModal
            isOpen={isAudioModalOpen}
            onClose={() => setIsAudioModalOpen(false)}
            audioRef={audioRef}
            isPlaying={isPlaying}
            duration={duration}
            currentTime={currentTime}
            playbackRate={playbackRate}
            isSeeking={isSeeking}
            togglePlayPause={togglePlayPause}
            handlePlaybackRateChange={handlePlaybackRateChange}
            seekAudio={seekAudio}
            handleProgressChange={handleProgressChange}
            handleMouseDownOnProgress={handleMouseDownOnProgress}
            handleMouseUpOnProgress={handleMouseUpOnProgress}
            formatTime={formatTime}
            playbackRates={playbackRates}
        />
        <AboutMeModal
            isOpen={isAboutModalOpen}
            onClose={() => setIsAboutModalOpen(false)}
        />
      </div>
  );
};

export default App;
