"use client";

import { cn } from "@/lib/utils";
import { motion, stagger, useAnimate, useInView } from "motion/react";
import { useEffect } from "react";

export const TypewriterEffect = ({
  words,
  className,
  cursorClassName,
}) => {
  // Normalize input to always be an array of objects: [{ text: "..." }]
  let normalizedWords = [];

  if (typeof words === "string") {
    normalizedWords = [{ text: words }];
  } else if (Array.isArray(words)) {
    // Handle array of strings or array of objects
    normalizedWords = words.map((item) =>
      typeof item === "string" ? { text: item } : item
    );
  } else {
    normalizedWords = [{ text: String(words || "") }];
  }

  // Split each word into characters
  const wordsArray = normalizedWords.map((word) => ({
    ...word,
    text: word.text.split(""),
  }));

  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);

  useEffect(() => {
    if (isInView) {
      animate(
        "span",
        { display: "inline-block", opacity: 1, width: "fit-content" },
        { duration: 0.3, delay: stagger(0.08), ease: "easeInOut" }
      );
    }
  }, [isInView]);

  const renderWords = () => (
    <motion.div ref={scope} className="inline">
      {wordsArray.map((word, idx) => (
        <div key={`word-${idx}`} className="inline-block mr-2">
          {word.text.map((char, index) => (
            <motion.span
              key={`char-${index}`}
              initial={{}}
              className={cn(
                "dark:text-white text-black opacity-0 hidden",
                word.className
              )}
            >
              {char}
            </motion.span>
          ))}
        </div>
      ))}
    </motion.div>
  );

  return (
    <div
      className={cn(
        "text-base sm:text-xl md:text-3xl lg:text-5xl font-bold text-center",
        className
      )}
    >
      {renderWords()}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className={cn(
          "inline-block rounded-sm w-[4px] h-4 md:h-6 lg:h-10 bg-blue-500",
          cursorClassName
        )}
      ></motion.span>
    </div>
  );
};
