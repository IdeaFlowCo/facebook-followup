import React from "react";
import { message } from "facebook-chat-api";

const message = (yourID: string) => (
  { body, type, senderID, messageID, threadID }: message,
  i: number
) =>
  type === "message" ? (
    <div
      className={
        (senderID === threadID ? "tl pr7" : "tr pl7 bg-black-10") +
        " pa2 avenir"
      }
      key={messageID === "tmp" ? messageID + i : messageID}
    >
      <span>{body}</span>
    </div>
  ) : (
    "event"
  );

export default ({
  currentHistory,
  reff,
  yourID
}: {
  currentHistory: message[];
  reff: React.MutableRefObject<null>;
  yourID: string;
}) => (
  <div className="overflow-scroll vh-75" ref={reff}>
    {currentHistory.map(message(yourID))}
  </div>
);
