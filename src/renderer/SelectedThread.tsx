import { thread } from "../common/resources";
import React from "react";

export default ({
  selectedThread,
  markUnread,
  snooze
}: {
  selectedThread: thread;
  markUnread: () => void;
  snooze: (t: thread) => () => void;
}) =>
  selectedThread ? (
    <div>
      <div onClick={markUnread} style={{ cursor: "pointer" }}>
        Mark as unread
      </div>
      {selectedThread.name}
      <div onClick={snooze(selectedThread)} style={{ cursor: "pointer" }}>
        Snooze
      </div>
    </div>
  ) : null;
