import React from "react";

export default ({
  sendMessage,
  reff
}: {
  sendMessage: (event?: any) => void;
  reff: React.RefObject<HTMLInputElement>;
}) => (
  <div className="pb4">
    <input
      ref={reff}
      className="w-100 h-100 pa2"
      onKeyPress={e => (e.key === "Enter" ? sendMessage() : null)}
    />
    <button onClick={sendMessage}>send</button>
  </div>
);

// const oldRef = el => {
//   this.chatInput = el;
// };
