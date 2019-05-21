import React, { useState, useEffect, useRef } from "react"; // import { Link } from "react-router-dom";
import { ipcRenderer } from "electron";
import _ from "lodash";
import {
  // resources,
  // actionNames,
  // ACTION_RESPONSE_PREFIX,
  useMessenStore,
  // friend,
  thread,
  message
} from "../common/resources";
import Threads from "./Threads";
import SelectedThread from "./selectedThread";
import {
  openThread,
  markUnread,
  snooze,
  Dict,
  getterSetter,
  sendMessage
} from "./stateLogic";
import ChatWindow from "./ChatWindow";
import ChatControls from "./ChatControls";
const yourID = "100009069356507";

export default () => {
  const chatInput = useRef<HTMLInputElement>(null);
  const scrollView = useRef(null);
  const { threads, messages } = useMessenStore(ipcRenderer) as {
    threads: getterSetter<Dict<thread>>;
    messages: getterSetter<Dict<message>>;
  };
  const [selectedThreadID, updateId] = useState("");
  const [listening, setListening] = useState(false);
  useEffect(() => {
    if (_.isEmpty(threads[0])) {
      ipcRenderer.send("GET_THREADS");
    }
  });
  useEffect(() => {
    if (!listening) {
      ipcRenderer.send("listen");
      setListening(true);
    }
  });
  console.log(messages);

  const selectedThread = threads && threads[0][selectedThreadID];
  return (
    <div className="container" data-tid="container">
      <div className="db fw-100 avenir pa2 w-50 vh-75 overflow-scroll">
        {threads && (
          <Threads
            selectedThreadID={selectedThreadID}
            onThreadClick={openThread(
              ipcRenderer,
              [selectedThreadID, updateId],
              threads
            )}
            list={Object.values(threads[0])}
          />
        )}
      </div>
      <div>
        {threads && selectedThread && (
          <SelectedThread
            markUnread={markUnread(threads, ipcRenderer, selectedThreadID)}
            snooze={snooze}
            selectedThread={selectedThread}
          />
        )}
        {messages && (
          <ChatWindow
            reff={scrollView}
            yourID={yourID}
            currentHistory={Object.values(messages[0])}
          />
        )}
        {messages && (
          <ChatControls
            reff={chatInput}
            sendMessage={sendMessage({
              selectedThreadID,
              messages,
              chatInput,
              yourID
            })}
          />
        )}
      </div>
    </div>
  );
};
