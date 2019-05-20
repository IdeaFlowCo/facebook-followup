import { thread } from "../common/resources";
import React from "react";

export default ({
  selectedThread,
  markUnread,
  snooze,
  styles
}: {
  selectedThread: thread;
  markUnread: () => void;
  snooze: (t: thread) => () => void;
  styles: any;
}) =>
  selectedThread ? (
    <div className={styles.right_column_controls}>
      <div onClick={markUnread} style={{ cursor: "pointer" }}>
        Mark as unread
      </div>
      {selectedThread.name}
      <div onClick={snooze(selectedThread)} style={{ cursor: "pointer" }}>
        Snooze
      </div>
    </div>
  ) : null;
