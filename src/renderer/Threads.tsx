import { thread } from "../common/resources";
import React from "react";

type threadDeps = {
  onThreadClick: (id: string) => void;
  selectedThreadID: string;
};

const thread = ({ onThreadClick, selectedThreadID }: threadDeps) => ({
  threadID,
  name,
  participants,
  unreadCount
}: thread) => {
  return (
    <a href="#" className="link">
      <div
        className="pa2"
        key={threadID}
        onClick={() => onThreadClick(threadID)}
      >
        {name || participants.map(p => p.name).join(", ")}
      </div>
    </a>
  );
};

export default ({
  list,
  onThreadClick,
  selectedThreadID
}: {
  list: thread[];
} & threadDeps) => (
  <div>{list.map(thread({ onThreadClick, selectedThreadID }))}</div>
);
