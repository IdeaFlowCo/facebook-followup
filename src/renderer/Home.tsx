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
let styles = require("./Home.css");

const yourID = "100009069356507";

// state: {
//     friendsList: friend[];
//     threadDict: { [x: string]: thread };
//     currentHistory: message[];
//     selectedThreadID: string;
//   } = {
//     friendsList: [],
//     threadDict: {},
//     currentHistory: [],
//     selectedThreadID: ""
//   };

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

  const selectedThread = threads && threads[0][selectedThreadID];
  console.log({ threads, messages });
  return (
    <div className={styles.container} data-tid="container">
      <div className={styles.left_column}>
        {threads && (
          <Threads
            styles={styles}
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
      <div className={styles.right_column}>
        {threads && selectedThread && (
          <SelectedThread
            styles={styles}
            markUnread={markUnread(threads, ipcRenderer, selectedThreadID)}
            snooze={snooze}
            selectedThread={selectedThread}
          />
        )}
        {messages && (
          <ChatWindow
            styles={styles}
            reff={scrollView}
            yourID={yourID}
            currentHistory={Object.values(messages[0])}
          />
        )}
        {messages && (
          <ChatControls
            styles={styles}
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
