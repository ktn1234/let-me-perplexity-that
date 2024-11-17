import { forwardRef } from "react";

const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className="px-5 py-2 rounded-full bg-secondary hover:bg-quaterternary transition-colors active:bg-quaterternary"
      {...props}
      onTouchStart={(e) => e.preventDefault()}
    >
      {children}
    </button>
  );
});
Button.displayName = "Button";

export default Button;
