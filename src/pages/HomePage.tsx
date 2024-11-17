import { useEffect, useState } from "react";
import config from "../config";
import Button from "../components/ui/Button";

function HomePage() {
  const [searchText, setSearchText] = useState<string>("");
  const [searchResults, setSearchResults] = useState<string>("");

  useEffect(() => {
    // Get query params from URL
    const queryParams = new URLSearchParams(window.location.search);
    const query = queryParams.get("q");

    // If query exists, set it as search text
    if (query) {
      setSearchText(query);
      handleSearch();
    }
  }, []);

  // Handle search logic
  const handleSearch = () => {
    const url = new URL(config.PERPLEXITY_URL);
    url.pathname = "/search";
    url.searchParams.append("q", searchText);
    setSearchResults(url.toString());
  };

  // Handle copy logic
  const handleCopy = () => {
    navigator.clipboard.writeText(searchResults);
    alert(`Copied Link: ${searchResults}`);
  };

  // Info message depending on search results
  const info = searchResults
    ? "All Done! Share the link below"
    : "Ask and you shall receive";

  return (
    <>
      <section>
        {/* Perplexity Logo / Text / Search Bar */}
        <span className="flex justify-center items-center mb-6">
          <img
            className="w-96"
            src="/perexplity-logo.png"
            alt="Perplexity Logo"
          />
        </span>
        <h1 className="font-bold text-2xl mb-6">
          Let Me Perplexity That For You...
        </h1>
        <div className="">
          <input
            className="text-black rounded-full w-96 px-5 py-3 focus:outline-none hover:shadow hover:shadow-quaterternary transition-shadow duration-300"
            type="text"
            placeholder="Type your question here..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            autoFocus
          />
        </div>
        {/* Ask Me Button */}
        <div className="mt-4">
          <Button onClick={handleSearch}>Ask Me</Button>
        </div>
        {/* Information */}
        <div className="mt-6 p-5 max-w-72 border-white rounded-md outline flex justify-center items-center mx-auto">
          <span>{info}</span>
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
