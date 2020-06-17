import React from "react";

function SvgPlayIcon(props) {
  return (
    <svg viewBox="0 0 22 22" {...props}>
      <circle cx={11} cy={11} r={10.6} fill="#fff" />
      <path d="M11 .8c5.7 0 10.3 4.6 10.3 10.3S16.7 21.3 11 21.3.8 16.7.8 11 5.3.8 11 .8m0-.8C4.9 0 0 4.9 0 11s4.9 11 11 11 11-4.9 11-11S17.1 0 11 0z" />
      <path
        fill="#fff"
        stroke="#000"
        strokeWidth={0.75}
        strokeMiterlimit={10}
        d="M16.5 11L7.4 5.8v10.4z"
      />
    </svg>
  );
}

export default SvgPlayIcon;
