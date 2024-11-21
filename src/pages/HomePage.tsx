import { useEffect, useRef, useState } from "react";
import config from "../config";
import Button from "../components/ui/Button";
import MouseCursor from "../components/ui/MouseCursor";

const DEFAULT_INFO = "Ask and you shall receive";
const STEP_ONE = "Step 1: Type in your question";
const STEP_TWO = "Step 2: Click the 'Ask Me' button";
const STEP_THREE = "Come on... Was it really that hard?";

function HomePage() {
  const [searchText, setSearchText] = useState<string>("");
  const [searchResults, setSearchResults] = useState<string>("");
  const [info, setInfo] = useState<string>(() => {
    const query = new URLSearchParams(window.location.search).get("q");
    return query ? STEP_ONE : DEFAULT_INFO;
  });
  const [hasQueryParams] = useState<boolean>(
    () => !!new URLSearchParams(window.location.search).get("q")
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const askMeButtonRef = useRef<HTMLButtonElement>(null);
  const infoRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Get query param "q" from URL
    const query = new URLSearchParams(window.location.search).get("q");

    if (
      inputRef.current &&
      cursorRef.current &&
      askMeButtonRef.current &&
      infoRef.current &&
      query
    ) {
      const input = inputRef.current;
      const cursor = cursorRef.current;
      const button = askMeButtonRef.current;
      const info = infoRef.current;

      // Get the input field position and size
      const inputRect = input.getBoundingClientRect();

      // Calculate the target position (input field) for the cursor
      const inputTargetX = inputRect.left + inputRect.width / 4;
      const inputTargetY = inputRect.top + inputRect.height / 4;

      // Animate the cursor to the target position (input field) using the Web Animations API with easing
      const animateCursorToInput = cursor.animate(
        [
          {
            transform: `translate(${cursor.style.transform || "0px, 0px"})`, // Starting position (initially at 0)
          },
          {
            transform: `translate(${inputTargetX}px, ${inputTargetY}px)`, // Final position after animation
          },
        ],
        {
          duration: 2000,
          easing: "ease-in-out",
        }
      );

      // Set up the onfinish event to call simulateTyping after the animation is complete
      animateCursorToInput.onfinish = async () => {
        // Update the cursor's transform property to the final position to ensure it stays there
        cursor.style.transform = `translate(${inputTargetX}px, ${inputTargetY}px)`;

        // Call simulateTyping with the query after the animation is done
        await simulateTyping(query, input);
        info.innerHTML = STEP_TWO;

        // Get the "Ask Me" button position and size
        const buttonRect = button.getBoundingClientRect();

        // Calculate the target position (center of the button) for the cursor
        const buttonTargetX = buttonRect.left + buttonRect.width / 3;
        const buttonTargetY = buttonRect.top + buttonRect.height / 5;

        // Animate the cursor to the target position (center of the button) using the Web Animations API with easing
        const animateCursorToButton = cursor.animate(
          [
            {
              transform: `translate(${cursor.style.transform || "0px, 0px"})`, // Starting position (initially at 0)
            },
            {
              transform: `translate(${buttonTargetX}px, ${buttonTargetY}px)`, // Final position after animation
            },
          ],
          {
            duration: 2000,
            easing: "ease-in-out",
          }
        );

        animateCursorToButton.onfinish = () => {
          // Update the cursor's transform property to the final position to ensure it stays there
          cursor.style.transform = `translate(${buttonTargetX}px, ${buttonTargetY}px)`;

          button.focus();
          button.classList.add("focus:bg-quaterternary");
          info.innerHTML = STEP_THREE;

          // Wait a few seconds and then redirect to Perplexity AI
          setTimeout(() => {
            const url = new URL(config.PERPLEXITY_URL);
            url.pathname = "/search";
            url.searchParams.append("q", query);

            // Redirect the current window to Perplexity AI
            window.location.href = url.toString();
          }, 3000);
        };
      };
    }
  }, []);

  // Smooth typing animation using requestAnimationFrame
  function simulateTyping(
    query: string,
    input: HTMLInputElement
  ): Promise<void> {
    return new Promise((resolve) => {
      input.focus(); // Focus the input field
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
        }

        // If we've typed all characters, resolve the Promise
        if (charCount === query.length) {
          resolve();
        }
      };

      // Start the typing animation
      requestAnimationFrame(type);
    });
  }

  // Handle search logic when "Enter" is pressed
  const handleSearch = () => {
    const url = new URL(window.location.origin);
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
        <input
          ref={inputRef}
          className="text-black rounded-full w-full min-[424px]:w-96 px-5 py-3 focus:outline-none hover:shadow hover:shadow-quaterternary transition-shadow duration-300"
          type="text"
          placeholder="Type your question here..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          autoFocus={!hasQueryParams}
        />
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
            className="text-quaterternary underline max-w-[75%] md:max-w-[50%] truncate block hover:text-sky-600"
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
