import { thread } from "../common/resources";
import React from "react";

type threadDeps = {
  onThreadClick: (id: string) => void;
  styles: { [x: string]: any };
  selectedThreadID: string;
};

const thread = ({ onThreadClick, styles, selectedThreadID }: threadDeps) => ({
  threadID,
  name,
  participants,
  unreadCount
}: thread) => (
  <div
    key={threadID}
    onClick={() => onThreadClick(threadID)}
    className={[
      styles.thread_item,
      threadID === selectedThreadID ? styles.thread_item_selected : "",
      unreadCount > 0 ? styles.thread_item_unread : ""
    ].join(" ")}
  >
    {name || participants.map(p => p.name).join(", ")}
  </div>
);

export default ({
  list,
  onThreadClick,
  styles,
  selectedThreadID
}: {
  list: thread[];
} & threadDeps) => (
  <div className={styles.thread_list}>
    {list.map(thread({ onThreadClick, styles, selectedThreadID }))}
  </div>
);
