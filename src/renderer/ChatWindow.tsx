import React from "react";
import { message } from "../common/resources";

const message = (yourID: string) => (
  { body, type, senderID, messageID }: any,
  i: number
) =>
  type === "message" ? (
    <div key={messageID === "tmp" ? messageID + i : messageID}>
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
}) => <div ref={reff}>{currentHistory.map(message(yourID))}</div>;
