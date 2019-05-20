import React from "react";
import { message } from "../common/resources";

const message = (yourID: string, styles: any) => (
  { body, type, senderID, messageID }: any,
  i: number
) =>
  type === "message" ? (
    <div
      key={messageID === "tmp" ? messageID + i : messageID}
      className={[
        styles.chat_bubble,
        senderID == yourID ? styles.yours : styles.theirs
      ].join(" ")}
    >
      <span>{body}</span>
    </div>
  ) : (
    "event"
  );

export default ({
  currentHistory,
  styles,
  reff,
  yourID
}: {
  currentHistory: message[];
  styles: any;
  reff: React.MutableRefObject<null>;
  yourID: string;
}) => (
  <div className={styles.chat_window} ref={reff}>
    {currentHistory.map(message(yourID, styles))}
  </div>
);
