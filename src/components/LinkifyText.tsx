import React from "react";

export function LinkifyText({ text, className = "" }: { text: string; className?: string }) {
  // Regex to match URLs starting with http:// or https://
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  if (!text) return null;
  
  const parts = text.split(urlRegex);
  
  return (
    <p className={className}>
      {parts.map((part, i) => {
        if (part.match(urlRegex)) {
          return (
            <a 
              key={i} 
              href={part} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-emerald-600 font-bold hover:underline break-words"
            >
              {part}
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}
