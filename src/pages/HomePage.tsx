import { useEffect, useRef, useState } from "react";
import config from "../config";
import Button from "../components/ui/Button";
import MouseCursor from "../components/ui/MouseCursor";

function HomePage() {
  const [searchText, setSearchText] = useState<string>("");
  const [searchResults, setSearchResults] = useState<string>("");
  const [info, setInfo] = useState<string>(() => {
    // Check if there are query params in the URL
    const queryParams = new URLSearchParams(window.location.search);
    const query = queryParams.get("q");

    if (!!query) {
      return "Step 1: Type in your question";
    }

    return "Ask and you shall receive";
  });
  const [hasQueryParams] = useState<boolean>(() => {
    // Check if there are query params in the URL
    const queryParams = new URLSearchParams(window.location.search);
    const query = queryParams.get("q");
    return !!query;
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const askMeButtonRef = useRef<HTMLButtonElement>(null);
  const infoRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Get query params from URL
    const queryParams = new URLSearchParams(window.location.search);
    const query = queryParams.get("q");

    // Move cursor to the input field (1/4 from the left edge)
    if (inputRef.current && cursorRef.current && query) {
      const inputRect = inputRef.current.getBoundingClientRect();
      animateCursorToInput(inputRect, query);
    }
  }, []);

  // Easing function (ease-in-out)
  const easeInOut = (t: number) => {
    return 0.5 - 0.5 * Math.cos(Math.PI * t);
  };

  // Function to animate cursor to the input field with easing
  const animateCursorToInput = (inputRect: DOMRect, query: string) => {
    const cursor = cursorRef.current;
    if (cursor) {
      const targetX = inputRect.left + inputRect.width / 8; // Target position: 1/8 of the way across the input field (from left edge)
      const targetY = inputRect.top + inputRect.height / 3; // Target position: 1/3 of the way down the input field

      // Get the initial cursor position (center of the cursor)
      const cursorRect = cursor.getBoundingClientRect();
      const startX = cursorRect.left + cursorRect.width / 2;
      const startY = cursorRect.top + cursorRect.height / 2;

      // Calculate the distance to move
      const distanceX = targetX - startX;
      const distanceY = targetY - startY;

      // Time duration for the animation (in milliseconds)
      const duration = 2000;
      const steps = 100; // Number of steps to take during the animation (more steps = smoother animation)
      const intervalTime = duration / steps;

      let currentStep = 0;

      // Animate cursor movement over the given duration
      const moveCursor = setInterval(() => {
        currentStep++;

        // Calculate progress (t) of the animation
        const t = currentStep / steps;

        // Apply easing function to progress
        const easedT = easeInOut(t);

        // Calculate the new position of the cursor based on eased progress
        const moveX = distanceX * easedT;
        const moveY = distanceY * easedT;

        // Set the cursor's new position, adjusting for cursor size (to keep it centered)
        cursor.style.transform = `translate(${
          startX + moveX - cursor.offsetWidth / 2
        }px, ${startY + moveY - cursor.offsetHeight / 2}px)`;

        // If we've completed the animation, stop the interval and focus the input
        if (currentStep === steps) {
          clearInterval(moveCursor);

          // Focus the search bar after the cursor movement is complete
          if (inputRef.current) {
            inputRef.current.focus();
            simulateTyping(query);
          }
        }
      }, intervalTime);
    }
  };

  // Smooth typing animation using requestAnimationFrame
  const simulateTyping = (query: string) => {
    const typingDuration = 1500; // Total typing time (in milliseconds)
    const typingSpeed = typingDuration / query.length; // Time per character

    const startTime = performance.now();

    const type = (time: number) => {
      const elapsedTime = time - startTime;
      const charCount = Math.floor(elapsedTime / typingSpeed);

      // Update the searchText based on the number of characters typed
      if (charCount <= query.length) {
        setSearchText(query.substring(0, charCount));
        requestAnimationFrame(type); // Continue the typing animation
      } else {
        if (infoRef.current) {
          infoRef.current.innerHTML = "Step 2: Click the 'Ask Me' button";
        }

        animateCursorToAskMeButton(query);
      }
    };

    // Start the typing animation
    requestAnimationFrame(type);
  };

  // Function to animate cursor to the "Ask Me" button with easing
  const animateCursorToAskMeButton = (query: string) => {
    const cursor = cursorRef.current;
    const askMeButton = askMeButtonRef.current;

    if (cursor && askMeButton) {
      const buttonRect = askMeButton.getBoundingClientRect();

      // Target position: center of the "Ask Me" button
      const targetX = buttonRect.left + buttonRect.width / 2;
      const targetY = buttonRect.top + buttonRect.height / 2;

      // Get the initial cursor position (center of the cursor)
      const cursorRect = cursor.getBoundingClientRect();
      const startX = cursorRect.left + cursorRect.width / 2;
      const startY = cursorRect.top + cursorRect.height / 2;

      // Calculate the distance to move
      const distanceX = targetX - startX;
      const distanceY = targetY - startY;

      // Time duration for the animation (in milliseconds)
      const duration = 1500; // You can adjust this duration to make it faster/slower
      const steps = 100; // Number of steps to take during the animation (more steps = smoother animation)
      const intervalTime = duration / steps;

      let currentStep = 0;

      // Animate cursor movement over the given duration
      const moveCursor = setInterval(() => {
        currentStep++;

        // Calculate progress (t) of the animation
        const t = currentStep / steps;

        // Apply easing function to progress
        const easedT = easeInOut(t);

        // Calculate the new position of the cursor based on eased progress
        const moveX = distanceX * easedT;
        const moveY = distanceY * easedT;

        // Set the cursor's new position, adjusting for cursor size (to keep it centered)
        cursor.style.transform = `translate(${
          startX + moveX - cursor.offsetWidth / 2
        }px, ${startY + moveY - cursor.offsetHeight / 2}px)`;

        // If we've completed the animation, stop the interval and focus the Ask Me button
        if (currentStep === steps) {
          clearInterval(moveCursor);

          // Focus the "Ask Me" button after the cursor movement is complete
          if (askMeButtonRef.current) {
            askMeButtonRef.current.focus();

            if (infoRef.current) {
              infoRef.current.innerHTML = "Come on... Was it really that hard?";
            }

            // After typing is complete, wait a few seconds and then redirect to Perplexity AI
            setTimeout(() => {
              const url = new URL(config.PERPLEXITY_URL);
              url.pathname = "/search";
              url.searchParams.append("q", query);

              // Redirect the current window to Perplexity AI
              window.location.href = url.toString();
            }, 3000);
          }
        }
      }, intervalTime);
    }
  };

  // Handle search logic when "Enter" is pressed
  const handleSearch = () => {
    const url = new URL(window.location.href);
    url.searchParams.append("q", searchText);
    setSearchResults(url.toString());
    setInfo("All Done! Share the link below");
  };

  // Handle copy logic
  const handleCopy = () => {
    navigator.clipboard.writeText(searchResults);
    alert(`Copied Link: ${searchResults}`);
  };

  return (
    <>
      <MouseCursor
        ref={cursorRef}
        className="absolute"
        style={{
          display: hasQueryParams ? "block" : "none",
        }}
      />
      <section>
        {/* Perplexity Logo / Text / Search Bar */}
        <div className="flex justify-center items-center mb-6">
          <img
            className="w-[384px] h-[96.72px]"
            src="/perexplity-logo.png"
            alt="Perplexity Logo"
          />
        </div>
        <h1 className="font-bold text-2xl mb-6">
          Let Me Perplexity That For You...
        </h1>
        <div>
          <input
            ref={inputRef}
            className="text-black rounded-full w-96 px-5 py-3 focus:outline-none hover:shadow hover:shadow-quaterternary transition-shadow duration-300"
            type="text"
            placeholder="Type your question here..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            autoFocus={!hasQueryParams}
          />
        </div>
        {/* Ask Me Button */}
        <div className="mt-4">
          <Button onClick={handleSearch} ref={askMeButtonRef}>
            Ask Me
          </Button>
        </div>
        {/* Information */}
        <div className="mt-6 p-5 max-w-72 border-white rounded-md outline flex justify-center items-center mx-auto">
          <span ref={infoRef}>{info}</span>
        </div>
      </section>
      {/* Search Results Section */}
      {searchResults && (
        <section className="mt-8 flex flex-col justify-center items-center">
          <a
            className="text-quaterternary underline w-3/4 md:w-1/2 truncate block hover:text-sky-600"
            href={searchResults}
            target="_blank"
            rel="noreferrer"
          >
            {searchResults}
          </a>
          {/* Copy URL Button */}
          <div className="mt-4">
            <Button onClick={handleCopy}>Copy URL</Button>
          </div>
        </section>
      )}
    </>
  );
}

export default HomePage;
