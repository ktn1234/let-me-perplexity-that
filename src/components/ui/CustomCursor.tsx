import { useState, useEffect } from "react";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    document.body.style.cursor = "none";
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    // Add event listener to track mouse movement
    window.addEventListener("mousemove", handleMouseMove);

    // Cleanup the event listener when component unmounts
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      className="fixed pointer-events-none bg-black rounded-full w-4 h-4 transform -translate-x-1/2 -translate-y-1/2 opacity-90 z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transition: "transform 0.1s ease-out", // Smooth cursor movement
      }}
    />
  );
};

export default CustomCursor;
