import { Textfit } from "react-textfit";
import React, { JSX } from "react";
import { marked } from "marked";

export default function generateRevealSlides(slide: string): Promise<string> {
    const renderer = new marked.Renderer();
      renderer.image = function({ href, title, text }) {
        const url = href.startsWith('http') ? href : `images/${href}`;
        // `<img src="${url}" alt="${text}" title="${title}" />
        return `<!--${url}-->`;
      };

    return Promise.resolve(marked(slide, { renderer }));
  }

export function generateHtmlSlides(slideHtml: string, index: number, len: number, color: string): JSX.Element {
  const commentMatch = slideHtml.match(/<!--(.*?)-->/g);
  const imageUrl = commentMatch ? commentMatch[0].replace(/<!--|-->/g, "").trim() : "";
  
  // Remove comments and check if there's any visible content left
  const cleanedSlideHtml = slideHtml.replace(/<!--.*?-->/g, "").replace(/<[^/>]+>\s*<\/[^>]+>/g, "").trim();

  console.log(cleanedSlideHtml);

  return (
    <section 
      key={index} 
      data-background-image={imageUrl}
      className="w-full h-full flex items-center justify-center"
    >
      <div className={`w-full h-full flex flex-col ${index === 0 || index === len - 1 ? 'items-center' : 'items-start'} justify-center p-24`} dangerouslySetInnerHTML={{ __html: cleanedSlideHtml }} />
    </section>
  );
}