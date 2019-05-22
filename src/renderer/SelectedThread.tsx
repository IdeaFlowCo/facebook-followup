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
    <div className="dib">
      <a href="#" className="dib pa2 link avenir" onClick={markUnread}>
        <div style={{ cursor: "pointer" }}>Mark as unread</div>{" "}
      </a>
      <div className="dib pa2 fw-700">{selectedThread.name}</div>
      <a
        href="#"
        className="dib pa2 link avenir"
        onClick={snooze(selectedThread)}
      >
        <div style={{ cursor: "pointer" }}>Snooze</div>
      </a>
    </div>
  ) : null;
