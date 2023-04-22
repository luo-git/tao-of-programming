import React, { useEffect, useMemo, useState } from 'react';

import './Quote.css';

type QuoteProps = React.ComponentPropsWithRef<'p'> & {
  quote: string;
  tags: string[];
};

function splitString(str: string, keywords: string[]): string[] {
  // Escape the special characters in the list of strings
  const escapedList = keywords.map((str) =>
    str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  );

  // Create a regular expression to match any string in the list of strings
  const regex = new RegExp(`(${escapedList.join('|')})`, 'g');

  // Find all matches of the regular expression in the string
  let match;
  let lastEndIndex = 0;
  const result = [];
  while ((match = regex.exec(str))) {
    const matchStartIndex = match.index;
    const matchEndIndex = matchStartIndex + match[0].length;
    const substring = str.slice(lastEndIndex, matchStartIndex);
    result.push(substring);
    result.push(match[0]);
    lastEndIndex = matchEndIndex;
  }
  result.push(str.slice(lastEndIndex));

  return result;
}

export default function Quote(props: QuoteProps) {
  const { quote, tags } = props;

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>();

  useEffect(() => {
    if (
      typeof speechSynthesis !== 'undefined' &&
      speechSynthesis.onvoiceschanged !== undefined
    ) {
      speechSynthesis.onvoiceschanged = () => {
        if (speechSynthesis.getVoices().length > 0) {
          setVoices(speechSynthesis.getVoices());
        }
      };
    }

    if (speechSynthesis.getVoices().length > 0) {
      setVoices(speechSynthesis.getVoices());
    }
  }, []);

  const highlightMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const tag of tags) {
      map.set(tag, `hsl(${Math.round(Math.random() * 360)}, 90%, 40%)`);
    }
    return map;
  }, [tags]);

  const highlightWord = (word: string, color: string, index: number) => {
    return (
      <span key={index} style={{ color }}>
        {word}
      </span>
    );
  };

  const getHighlightedText = (text: string, tags: string[]) => {
    const result = splitString(text, tags);

    return result.map((part, index) => {
      const tagIndex = tags.indexOf(part);
      if (tagIndex === -1) {
        return part;
      }
      return highlightWord(part, highlightMap.get(tags[tagIndex]) ?? '', index);
    });
  };

  const speak = (sentence: string) => {
    if ('speechSynthesis' in window) {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }

      const message = new SpeechSynthesisUtterance(sentence);

      const voice = voices.find((v) => v.name === selectedVoice);
      if (voice) {
        message.voice = voice;
      }

      speechSynthesis.speak(message);
    } else {
      console.log('Speech synthesis is not supported');
    }
  };

  return (
    <div className="quote-container">
      <div className="speech-container">
        <select
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value)}
        >
          {voices.map((v) => (
            <option key={v.name} value={v.name}>
              {v.name} {v.lang}
            </option>
          ))}
        </select>
        <button className="navbar-button" onClick={() => speak(quote)}>
          Speech
        </button>
      </div>
      <p className="main-quote">{getHighlightedText(quote, tags)}</p>
      <p className="quote-tags">Tags: {tags.join(', ')}</p>
    </div>
  );
}
