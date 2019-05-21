import React from "react";

export default ({
  sendMessage,
  reff
}: {
  sendMessage: (event?: any) => void;
  reff: React.RefObject<HTMLInputElement>;
}) => (
  <div>
    <input
      ref={reff}
      onKeyPress={e => (e.key === "Enter" ? sendMessage() : null)}
    />
    <button onClick={sendMessage}>send</button>
  </div>
);

// const oldRef = el => {
//   this.chatInput = el;
// };
