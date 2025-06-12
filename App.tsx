
import React, { useState, useRef, useEffect, ChangeEvent, useLayoutEffect } from 'react';
import { LanguageOption } from './types';
import { CONTENT_LANGUAGES, getUITranslations, UITranslationStrings } from './constants';

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

const LS_LANG_ID_KEY = 'vishnuSahasranamamLangId';
const LS_FONT_SIZE_KEY = 'vishnuSahasranamamFontSize';
const LS_PLAYBACK_RATE_KEY = 'vishnuSahasranamamPlaybackRate';
const PLAYBACK_RATES = [0.75, 1, 1.25, 1.5, 2];


const LanguageSelectionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  languages: LanguageOption[];
  currentLanguageId: string;
  onSelectLanguage: (language: LanguageOption) => void;
  uiStrings: UITranslationStrings;
}> = ({ isOpen, onClose, languages, currentLanguageId, onSelectLanguage, uiStrings }) => {
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
            <h2 id="language-modal-title" className="text-xl font-semibold text-orange-700">{uiStrings.selectLanguageTitle}</h2>
            <button
                ref={closeButtonRef}
                onClick={onClose}
                className="p-2 text-gray-600 hover:text-orange-600 rounded-full hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                aria-label={uiStrings.closeLanguageSelection}
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
  uiStrings: UITranslationStrings;
  onJumpToStotram: () => void;
}> = ({
        isOpen, onClose, audioRef, isPlaying, duration, currentTime, playbackRate,
        togglePlayPause, handlePlaybackRateChange, seekAudio, handleProgressChange,
        handleMouseDownOnProgress, handleMouseUpOnProgress, formatTime, uiStrings,
        onJumpToStotram
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
            <h2 id="audio-player-modal-title" className="text-xl font-semibold text-orange-700">{uiStrings.audioPlayerTitle}</h2>
            <button
                ref={closeButtonRef}
                onClick={onClose}
                className="p-2 text-gray-600 hover:text-orange-600 rounded-full hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                aria-label={uiStrings.closeAudioPlayer}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
            <div className="flex flex-col items-center">
              <button
                  onClick={togglePlayPause}
                  className="p-3 sm:p-4 rounded-full bg-orange-600 text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-orange-100 transition-colors shadow-lg"
                  aria-label={isPlaying ? uiStrings.pauseAudio : uiStrings.playAudio}
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
              <span className="block text-sm font-medium text-orange-700 mt-1">{isPlaying ? uiStrings.pauseAudio.split(' ')[0] : uiStrings.playAudio.split(' ')[0]}</span>
            </div>

            <div className="flex items-center justify-around sm:justify-between space-x-2 sm:space-x-3">
              <button
                  onClick={() => seekAudio(-10)}
                  aria-label={uiStrings.seekBackward}
                  className="flex items-center justify-center py-2.5 px-4 bg-orange-200 text-orange-800 rounded-lg shadow-sm hover:bg-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors text-sm sm:text-md font-medium"
                  disabled={!duration}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 mr-1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                {uiStrings.seekBackward.split(' ')[2]} {uiStrings.seekBackward.split(' ')[3]}
              </button>
              <span className="text-sm sm:text-md text-gray-700 min-w-[90px] sm:min-w-[110px] text-center tabular-nums font-medium">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
              <button
                  onClick={() => seekAudio(10)}
                  aria-label={uiStrings.seekForward}
                  className="flex items-center justify-center py-2.5 px-4 bg-orange-200 text-orange-800 rounded-lg shadow-sm hover:bg-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors text-sm sm:text-md font-medium"
                  disabled={!duration}
              >
                {uiStrings.seekForward.split(' ')[2]} {uiStrings.seekForward.split(' ')[3]}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 ml-1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>

            <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleProgressChange}
                onMouseDown={handleMouseDownOnProgress}
                onMouseUp={handleMouseUpOnProgress}
                className="w-full h-3 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-600 focus:outline-none focus:ring-1 focus:ring-orange-500"
                aria-label={uiStrings.audioProgress}
                disabled={!duration}
            />

            <div className="flex items-center justify-center flex-wrap gap-1.5 sm:gap-2 pt-1">
              <span className="text-base text-gray-700 mr-1.5 font-medium">{uiStrings.speedLabel}</span>
              {PLAYBACK_RATES.map(rate => (
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
            <button
                onClick={onJumpToStotram}
                className="w-full mt-3 py-2.5 px-4 bg-orange-200 text-orange-700 rounded-lg shadow-sm hover:bg-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-orange-50 transition-colors text-sm font-medium flex items-center justify-center"
                disabled={!duration}
                aria-label={uiStrings.jumpToStotram}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 5.25v13.5" />
              </svg>
              {uiStrings.jumpToStotram}
            </button>
          </div>
        </div>
      </div>
  );
};

const AboutMeModal: React.FC<{ isOpen: boolean; onClose: () => void; uiStrings: UITranslationStrings; }> = ({ isOpen, onClose, uiStrings }) => {
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
              <span className="emoji" role="img" aria-label="Folded hands">🙏</span> {uiStrings.aboutAppTitle}
            </h2>
            <button
                ref={closeButtonRef}
                onClick={onClose}
                className="p-2 text-gray-600 hover:text-orange-600 rounded-full hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                aria-label={uiStrings.closeAboutApp}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-6 space-y-4 overflow-y-auto text-sm sm:text-base text-gray-700 leading-relaxed">
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
              Got feedback, found a mischievous bug <span className="emoji" role="img" aria-label="Bug">🐛</span>, or just want to say "ഹായ്!" (that's "Hi!" in Malayalam)?
              Feel free to drop a line at: <a href="mailto:ajaynair59@gmail.com" className="text-orange-600 hover:text-orange-700 underline">ajaynair59 [at] gmail [dot] com</a>.
            </p>
            <p>Happy reading and listening, or as we say in Malayalam, "നന്നായി വായിക്കുകയും കേൾക്കുകയും ചെയ്യുക!" (Nannaayi vaayikkukayum kelkkukayum cheyyuka!) <span className="emoji" role="img" aria-label="Smiling face with sunglasses">😎</span></p>
          </div>
        </div>
      </div>
  );
};


const App: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>(() => {
    const storedLangId = localStorage.getItem(LS_LANG_ID_KEY);
    if (storedLangId) {
      const langOption = CONTENT_LANGUAGES.find(lang => lang.id === storedLangId);
      if (langOption) return langOption;
    }
    return CONTENT_LANGUAGES[0];
  });

  const [fontSize, setFontSize] = useState<number>(() => {
    const storedFontSize = localStorage.getItem(LS_FONT_SIZE_KEY);
    if (storedFontSize) {
      const parsedSize = parseFloat(storedFontSize);
      if (!isNaN(parsedSize)) {
        return Math.max(0.8, Math.min(2.5, parsedSize));
      }
    }
    return 1.25;
  });

  const [playbackRate, setPlaybackRate] = useState<number>(() => {
    const storedPlaybackRate = localStorage.getItem(LS_PLAYBACK_RATE_KEY);
    if (storedPlaybackRate) {
      const parsedRate = parseFloat(storedPlaybackRate);
      if (PLAYBACK_RATES.includes(parsedRate)) {
        return parsedRate;
      }
    }
    return 1;
  });

  const [uiStrings, setUiStrings] = useState<UITranslationStrings>(getUITranslations(selectedLanguage.id));
  const [areControlsVisible, setAreControlsVisible] = useState<boolean>(true);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<boolean>(false);
  const [isAudioPlayerModalOpen, setIsAudioPlayerModalOpen] = useState<boolean>(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isSeeking, setIsSeeking] = useState<boolean>(false);
  const isSeekingRef = useRef<boolean>(false);

  const stickyControlsRef = useRef<HTMLDivElement>(null);
  const mainContentCardRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef<boolean>(false);
  const previousLangIdRef = useRef<string>(selectedLanguage.id);
  const [showScrollToTopButton, setShowScrollToTopButton] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem(LS_LANG_ID_KEY, selectedLanguage.id);
    setUiStrings(getUITranslations(selectedLanguage.id));
  }, [selectedLanguage]);

  useEffect(() => {
    localStorage.setItem(LS_FONT_SIZE_KEY, fontSize.toString());
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem(LS_PLAYBACK_RATE_KEY, playbackRate.toString());
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);


  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      audio.playbackRate = playbackRate; // Apply initial or loaded playback rate

      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
        audio.playbackRate = playbackRate; // Re-apply in case it changed
      }
      const handleTimeUpdate = () => {
        if (!isSeekingRef.current) {
          setCurrentTime(audio.currentTime);
        }
      };
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [playbackRate]); // Also depend on playbackRate to re-setup if it changes early


  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    isMountedRef.current = true;
    previousLangIdRef.current = selectedLanguage.id; // Initialize with current lang
  }, []);


  useEffect(() => {
    if (!isMountedRef.current || !mainContentCardRef.current || !stickyControlsRef.current) return;

    if (previousLangIdRef.current !== selectedLanguage.id) {
      const stickyControlsHeight = stickyControlsRef.current.offsetHeight;
      const cardTop = mainContentCardRef.current.getBoundingClientRect().top + window.scrollY;
      const targetScrollY = cardTop - stickyControlsHeight - 20;

      window.scrollTo({
        top: Math.max(0, targetScrollY),
        behavior: 'smooth'
      });
      previousLangIdRef.current = selectedLanguage.id;
    }
  }, [selectedLanguage, areControlsVisible]);


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollToTopButton(true);
      } else {
        setShowScrollToTopButton(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const handleLanguageSelect = (language: LanguageOption) => {
    setSelectedLanguage(language);
    setIsLanguageModalOpen(false);
  };

  const renderContent = (text: string, langId: string) => {
    const lines = text.split('\n');
    const isSpecificEnglish = langId === 'english';

    return lines.map((line, index) => {
      const trimmedLine = line.trim();
      if (trimmedLine === '') {
        return <br key={`br-${index}`} />;
      }
      const isHeader = isSpecificEnglish && SPECIFIC_ENGLISH_HEADERS.has(trimmedLine);
      const isNumericLine = /^\d+A?$/.test(trimmedLine.replace(/[॥।॥ ..\s]/g, ''));
      const isSpecialStanza = /^\s*॥\s*\d+\s*॥\s*$/.test(trimmedLine);

      const highlightRegex = isSpecificEnglish ?
          /(\b(?:Pūrva Pīṭhikā|Srī Vaiśampāyana Uvācha|Yudhiṣṭhira Uvācha|Srī Bhīṣma Uvācha|Pūrvanyāsaḥ|Karanyāsaḥ|Aṅganyāsaḥ|Pañchapūja|Dhyānam|Uttara pīṭhikā|phalaśrutiḥ|Arjuna Uvācha|Srī Bhagavān Uvācha|Vyāsa Uvācha|Pārvati Uvācha|Iśvara Uvācha|Brahmōvācha|Sañjaya Uvācha)\b|\b\d+[A-Za-z]?\b)/g :
          /(\b\d+[A-Za-z]?\b)/g;

      const parts = trimmedLine.split(highlightRegex);

      if (isHeader || isNumericLine || isSpecialStanza) {
        return (
            <p
                key={index}
                className={`text-center font-semibold text-orange-700 ${isHeader ? 'text-lg my-3' : 'text-sm my-1'}`}
            >
              {trimmedLine}
            </p>
        );
      }

      return (
          <p key={index} className="my-1 leading-relaxed sm:leading-loose md:leading-loose">
            {parts.map((part, i) =>
                highlightRegex.test(part) ? (
                    <span key={i} className="text-orange-600 font-semibold mr-1">
                {part}
              </span>
                ) : (
                    part
                )
            )}
          </p>
      );
    });
  };


  const handleFontSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseFloat(event.target.value);
    setFontSize(Math.max(0.8, Math.min(2.5, newSize)));
  };

  const adjustFontSize = (amount: number) => {
    setFontSize(prevSize => {
      const newSize = parseFloat((prevSize + amount).toFixed(2));
      return Math.max(0.8, Math.min(2.5, newSize));
    });
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => console.error("Error playing audio:", error));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
  };

  const seekAudio = (amount: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += amount;
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = parseFloat(event.target.value);
      setCurrentTime(newTime);
    }
  };

  const handleMouseDownOnProgress = () => {
    setIsSeeking(true);
    isSeekingRef.current = true;
  };

  const handleMouseUpOnProgress = (event: React.MouseEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = parseFloat(event.currentTarget.value);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
    setIsSeeking(false);
    isSeekingRef.current = false;
  };

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const audioButtonText = () => {
    let base = uiStrings.audioControlsBase;
    if (isPlaying) {
      base += uiStrings.audioStatusPlaying;
    } else if (audioRef.current && audioRef.current.currentTime > 0 && audioRef.current.paused) {
      base += uiStrings.audioStatusPaused;
    }
    return base;
  };

  const handleJumpToStotram = () => {
    if (audioRef.current) {
      const targetTime = 6 * 60 + 40; // 400 seconds
      audioRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };


  return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 via-amber-50 to-orange-100 flex flex-col">
        <header className="bg-orange-600 text-white shadow-md py-4 px-4 sm:px-6">
          <div className="container mx-auto max-w-5xl flex flex-col items-center">
            <img
                src="https://mir-s3-cdn-cf.behance.net/projects/404/0e2c1c135159097.Y3JvcCwyMTYwLDE2ODksMCwxMzM.jpg"
                alt="Image of Lord Vishnu"
                className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-2 rounded-full shadow-lg border-2 border-orange-300 object-cover"
            />
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center justify-center">
                Vishnu Sahasranamam
              </h1>
              <p className="text-xs sm:text-sm text-orange-100">The Thousand Names of Vishnu - Multilingual</p>
            </div>
          </div>
        </header>

        <div
            ref={stickyControlsRef}
            className="sticky top-0 z-20 bg-white/80 backdrop-blur-md shadow-sm rounded-b-lg"
        >
          <div className="container mx-auto max-w-5xl p-2.5 sm:p-3 border-b border-orange-200 flex justify-end items-center">
            <button
                onClick={() => setAreControlsVisible(!areControlsVisible)}
                className="py-2 px-3.5 text-xs sm:text-sm font-medium text-orange-700 bg-orange-100 hover:bg-orange-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                aria-expanded={areControlsVisible}
            >
              {areControlsVisible ? uiStrings.hideSettings : uiStrings.settings}
            </button>
          </div>

          {areControlsVisible && (
              <div className="container mx-auto max-w-5xl p-3 sm:p-4 border-t border-orange-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 items-center">
                  <div className="flex flex-col items-start">
                    <button
                        onClick={() => setIsLanguageModalOpen(true)}
                        className="w-full sm:w-auto py-2.5 px-5 text-sm font-medium text-orange-700 bg-orange-100 hover:bg-orange-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors flex items-center justify-center"
                        aria-haspopup="dialog"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-2">
                        <path d="M7.75 2.75a.75.75 0 0 0-1.5 0V3.5h-2.5a.75.75 0 0 0 0 1.5h2.5V6a.75.75 0 0 0 1.5 0V5h2.5a.75.75 0 0 0 0-1.5h-2.5V2.75Z" />
                        <path fillRule="evenodd" d="M5.057 7.224a.75.75 0 0 0 .243.527l2.25 1.946a.75.75 0 0 0 .998-.057l3.25-3.5a.75.75 0 0 0-1.118-.984L7.875 6.87l-1.47-1.26a.75.75 0 0 0-1.348.414Z" clipRule="evenodd" />
                        <path d="M3 9.5a.75.75 0 0 1 .75-.75h7a.75.75 0 0 1 0 1.5h-7a.75.75 0 0 1-.75-.75Z" />
                        <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 0 0 3 3.5v10A1.5 1.5 0 0 0 4.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-2.637a3.513 3.513 0 0 1-1.5-.808V13.5a.75.75 0 0 1-.75.75h-2.645a3.503 3.503 0 0 1-.533-.076l-.467-.107-.308-.072c-.278-.064-.558-.13-.842-.202S9.301 13.5 9 13.5H4.5a.75.75 0 0 1-.75-.75V9.045A3.515 3.515 0 0 1 5.637 7.5h.863a.75.75 0 0 0 .75-.75V3.5A.75.75 0 0 1 8 2.75h5.75a.75.75 0 0 1 .75.75v2.637a3.516 3.516 0 0 1 1.5.808V3.5A1.5 1.5 0 0 0 14.5 2h-10Z" clipRule="evenodd" />
                      </svg>
                      {uiStrings.changeLanguage}
                    </button>
                  </div>

                  <div className="flex flex-col items-start">
                    <button
                        onClick={() => setIsAudioPlayerModalOpen(true)}
                        className="w-full sm:w-auto py-2.5 px-5 text-sm font-medium text-orange-700 bg-orange-100 hover:bg-orange-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors flex items-center justify-center"
                        aria-haspopup="dialog"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-2">
                        <path d="M7 4a3 3 0 0 1 6 0v6a3 3 0 1 1-6 0V4Z" />
                        <path d="M5.5 4a.5.5 0 0 0-1 0v6a4.5 4.5 0 0 0 8.007 2.01l.993.993a.5.5 0 1 0 .707-.707l-.993-.993A4.5 4.5 0 0 0 11.5 10V4a.5.5 0 0 0-1 0v6a3.5 3.5 0 0 1-7 0V4Z" />
                      </svg>
                      {audioButtonText()}
                    </button>
                  </div>

                  <div className="flex flex-col items-start md:items-center">
                    <div className="flex items-center space-x-2 w-full md:w-auto">
                      <span className="text-sm font-medium text-gray-700 mr-1 whitespace-nowrap">{uiStrings.textSizeLabel}</span>
                      <button
                          onClick={() => adjustFontSize(-0.1)}
                          className="p-1.5 text-orange-700 bg-orange-100 hover:bg-orange-200 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
                          aria-label={uiStrings.decreaseTextSize}
                      >A-</button>
                      <input
                          type="range"
                          min="0.8"
                          max="2.5"
                          step="0.05"
                          value={fontSize}
                          onChange={handleFontSizeChange}
                          className="w-full md:w-24 h-3 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                          aria-label={uiStrings.adjustTextSize}
                      />
                      <button
                          onClick={() => adjustFontSize(0.1)}
                          className="p-1.5 text-orange-700 bg-orange-100 hover:bg-orange-200 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
                          aria-label={uiStrings.increaseTextSize}
                      >A+</button>
                    </div>
                  </div>
                </div>
              </div>
          )}
        </div>


        <main className="container mx-auto max-w-3xl p-4 sm:p-6 flex-grow">
          <div ref={mainContentCardRef} className="bg-white shadow-xl rounded-lg p-5 sm:p-8 ">
            <div
                className="font-serif text-gray-800 prose-sm sm:prose-base md:prose-lg max-w-none"
                style={{ fontSize: `${fontSize}rem` }}
                lang={selectedLanguage.id === 'english' ? 'en' : selectedLanguage.id}
            >
              {renderContent(selectedLanguage.contentText, selectedLanguage.id)}
            </div>
          </div>
        </main>

        <footer className="py-6 text-center">
          <button
              onClick={() => setIsAboutModalOpen(true)}
              className="text-sm text-orange-600 hover:text-orange-700 hover:underline focus:outline-none focus:ring-1 focus:ring-orange-400 rounded mb-2"
              aria-haspopup="dialog"
          >
            {uiStrings.aboutThisApp}
          </button>
          <p className="text-xs text-gray-500">
            {uiStrings.copyrightText.replace('{YEAR}', new Date().getFullYear().toString())}
          </p>
        </footer>

        {showScrollToTopButton && (
            <button
                onClick={handleScrollToTop}
                className="fixed bottom-6 right-6 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 px-4 rounded-full shadow-lg transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                title={uiStrings.scrollToTop}
                aria-label={uiStrings.scrollToTop}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
              </svg>
            </button>
        )}

        <audio ref={audioRef} src="/vishnu-sahasranamam/vishnu-sahasranamam.mp3" preload="metadata" />

        <LanguageSelectionModal
            isOpen={isLanguageModalOpen}
            onClose={() => setIsLanguageModalOpen(false)}
            languages={CONTENT_LANGUAGES}
            currentLanguageId={selectedLanguage.id}
            onSelectLanguage={handleLanguageSelect}
            uiStrings={uiStrings}
        />
        <AudioPlayerModal
            isOpen={isAudioPlayerModalOpen}
            onClose={() => setIsAudioPlayerModalOpen(false)}
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
            uiStrings={uiStrings}
            onJumpToStotram={handleJumpToStotram}
        />
        <AboutMeModal
            isOpen={isAboutModalOpen}
            onClose={() => setIsAboutModalOpen(false)}
            uiStrings={uiStrings}
        />
      </div>
  );
};

export default App;
