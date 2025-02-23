import React, { useEffect, useRef, useState } from 'react';
import Reveal from 'reveal.js';
import { marked } from 'marked';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/black.css';
import './slide.css';
import { Input } from '@/components/ui/input';
import generateRevealSlides, { generateHtmlSlides } from '../handlers/templateTranslator';

interface SlidesProps {
  markdown: string;
}

const Slides: React.FC<SlidesProps> = ({ markdown }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const revealInstance = useRef<Reveal.Api | null>(null);
  const [slides, setSlides] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [color, setColor] = useState("#ec407a");
  
  
  useEffect(() => {
    // Process markdown only when input changes
    const processSlides = async () => {
      const strippedMarkdown = markdown.split('\n').map(line => line.trimEnd()).join('\n');
      console.log(strippedMarkdown);
      const processedSlides = markdown.trim() ?
        await Promise.all(strippedMarkdown.split("\n---\n").map(slide => generateRevealSlides(slide))) :
        ["<h1>Welcome</h1><p>Your first slide</p>"];
      setSlides(processedSlides);
    };
    processSlides();
        }, [markdown]);

  useEffect(() => {
    if (!containerRef.current || slides.length === 0) return;

    // Clean up previous Reveal instance
    if (revealInstance.current) {
      revealInstance.current.destroy();
      revealInstance.current = null;
    }

    // Ensure slides exist before initializing
    if (!containerRef.current.querySelector('.slides section')) return;

    // Initialize Reveal.js with full height
    revealInstance.current = new Reveal({
      controls: true,
      progress: true,
      center: true,
      hash: true,
      margin: 0,
      // embedded: true,
      width: 960,
      height: 700,
      transition: 'none',
    });

    revealInstance.current.initialize().then(() => setIsInitialized(true));

    return () => {
      if (revealInstance.current) revealInstance.current.destroy();
    };
  }, [slides]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {/* Loading Indicator */}
      {!isInitialized && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <div className="h-12 w-12 border-4 border-gray-300 border-t-blue-500 animate-spin rounded-full"></div>
        </div>
      )}

      {/* Reveal.js container */}
      <div className={`reveal h-full w-full ${!isInitialized ? 'invisible' : 'visible'}`} style={{ backgroundColor : color }}>
        <div className="absolute top-4 right-4 z-10">
        <Input
  type="color"
  id="colorPicker"
  value={color}
  className='w-12 
    h-12 
    rounded-full 
    cursor-pointer 
    hover:scale-105 
    transition-transform 
    duration-200
    ease-in-out
    border-4
    border-white 
    shadow-lg
    appearance-none
    p-0 
    [&::-webkit-color-swatch-wrapper]:p-0 
    [&::-webkit-color-swatch]:p-0 
    [&::-webkit-color-swatch]:m-0 
    [&::-webkit-color-swatch]:w-full 
    [&::-webkit-color-swatch]:h-full 
    [&::-webkit-color-swatch]:border-none 
    [&::-webkit-color-swatch]:rounded-full
    [&::-moz-color-swatch]:border-none
    [&::-moz-color-swatch]:w-full 
    [&::-moz-color-swatch]:h-full 
    [&::-moz-color-swatch]:rounded-full'
  onChange={(e) => {
    const c = e.target.value;
    console.log(c);
    setColor(c);
  }}
/>
        </div>
        <div className="slides w-full h-full flex items-center justify-center">
        {slides.map((slideHtml, index) => {
          // Extract all comments
          return generateHtmlSlides(slideHtml, index, slides.length, color);
        })}

        </div>
      </div>
    </div>
  );
};

export default Slides;