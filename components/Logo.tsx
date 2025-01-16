export const SafeCircleLogo = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="inline-block mr-2"
  >
    <path
      d="M20 2L4 9.3V18.6C4 27.4 10.6 35.5 20 38C29.4 35.5 36 27.4 36 18.6V9.3L20 2Z"
      className="stroke-primary"
      strokeWidth="2"
      fill="none"
    >
      <animate
        attributeName="stroke-dasharray"
        from="0 100"
        to="100 100"
        dur="2s"
        fill="freeze"
      />
    </path>
  </svg>
);