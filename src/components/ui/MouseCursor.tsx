import { forwardRef } from "react";

const MouseCursor = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  return (
    <div ref={ref} {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24px"
        height="24px"
      >
        <path
          d="M8.3,3.213l9.468,8.836c0.475,0.443,0.2,1.24-0.447,1.296L13.2,13.7l2.807,6.21c0.272,0.602,0.006,1.311-0.596,1.585l0,0 c-0.61,0.277-1.33,0-1.596-0.615L11.1,14.6l-2.833,2.695C7.789,17.749,7,17.411,7,16.751V3.778C7,3.102,7.806,2.752,8.3,3.213z"
          fill="black" // The fill color (black)
          stroke="white" // The stroke color (white for the outline)
          strokeWidth="1" // Adjust stroke width to make the outline visible
        />
      </svg>
    </div>
  );
});
MouseCursor.displayName = "MouseCursor";

export default MouseCursor;
