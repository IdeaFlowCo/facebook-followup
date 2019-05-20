import React from "react";

export default ({
  styles,
  sendMessage,
  reff
}: {
  styles: any;
  sendMessage: (event?: any) => void;
  reff: React.RefObject<HTMLInputElement>;
}) => (
  <div className={styles.chat_controls}>
    <input
      className={styles.chat_input}
      ref={reff}
      onKeyPress={e => (e.key === "Enter" ? sendMessage() : null)}
    />
    <button className={styles.chat_send} onClick={sendMessage}>
      send
    </button>
  </div>
);

// const oldRef = el => {
//   this.chatInput = el;
// };
