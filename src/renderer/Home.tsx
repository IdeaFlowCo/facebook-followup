import React, { Component } from "react"; // import { Link } from "react-router-dom";
import { ipcRenderer } from "electron";
import _ from "lodash";
let styles = require("./Home.css");

type Props = {};

type participant = {
  name: string;
};

type thread = {
  threadID: string;
  name: string;
  participants: participant[];
  unreadCount: number;
};
type history = {
  messageID: string;
  timestamp: number;
  body: string | null;
  type: string;
  senderID: string;
  threadID: string;
};

type friend = {};

const yourID = "100009069356507";

export default class Home extends Component<Props, {}> {
  // props: Props;
  state: {
    friendsList: friend[];
    threadDict: { [x: string]: thread };
    currentHistory: history[];
    selectedThreadID: string;
    loginApproval?: string;
  } = {
    friendsList: [],
    threadDict: {},
    currentHistory: [],
    selectedThreadID: ""
  };

  chatInput: HTMLInputElement | null = null;
  scrollview: HTMLDivElement | null = null;

  constructor(props: {}) {
    super(props);
    ipcRenderer.on("message", this.newMessage);
    ipcRenderer.on("login-approval", () => {
      this.setState({ loginApproval: "" });
    });
    ipcRenderer.on("RCV_GET_CONTACTS", this.getFriendsListResponse);
    ipcRenderer.on("getThreadListResponse", this.getThreadListResponse);
    ipcRenderer.on("getThreadHistoryResponse", this.getThreadHistoryResponse);
    ipcRenderer.on("sendMessageResponse", this.sendMessageResponse);
  }

  newMessage = (event: Electron.Event, message: history) => {
    if (message.threadID === this.state.selectedThreadID) {
      this.setState({
        currentHistory: this.state.currentHistory.concat([message])
      });
    }
  };

  getFriendsListResponse = (event: Electron.Event, friendsList: friend[]) => {
    console.log(event, friendsList);
    this.setState({ friendsList });
  };

  getThreadListResponse = (event: Electron.Event, threadList: thread[]) => {
    console.log(threadList, event);
    this.setState({
      threadList: threadList.map(thread => {
        return { ...thread, snoozed: false };
      })
    });
  };

  getThreadHistoryResponse = (
    event: Electron.Event,
    currentHistory: history[]
  ) => {
    console.log(currentHistory);
    this.setState({ currentHistory });
  };

  openThread = (threadID: string) => {
    ipcRenderer.send("getThreadHistory", {
      threadID,
      amount: 100,
      timestamp: null
    });

    ipcRenderer.send("markAsRead", {
      threadID,
      read: true
    });

    this.setState({
      selectedThreadID: threadID,
      threadList: _.mapValues(this.state.threadDict, thread =>
        thread.threadID === threadID ? { ...thread, unreadCount: 0 } : thread
      )
    });
  };

  sendMessageResponse = (e: Electron.Event, data: history) => {
    // Only care about updating the temp message we had created if we're still focused on that
    // thread, otherwise we're gonna re-fetch.
    if (this.state.selectedThreadID === data.threadID) {
      let closestSoFar = Number.MAX_VALUE;
      let closestSoFarIndex = -1;
      let curMessage = { messageID: "tmp" };
      for (var i = 0; i < this.state.currentHistory.length; i++) {
        let diff = Math.abs(
          this.state.currentHistory[i].timestamp - data.timestamp
        );
        if (diff < closestSoFar && curMessage.messageID === "tmp") {
          closestSoFar = diff;
          closestSoFarIndex = i;
        }
      }

      let currentHistory = this.state.currentHistory.map((message, i) => {
        if (closestSoFarIndex === i) {
          return {
            ...message,
            messageID: data.messageID
          };
        }

        return message;
      });

      this.setState({ currentHistory });
    }
  };

  sendMessage = () => {
    const threadID = this.state.selectedThreadID;
    ipcRenderer.send("sendMessage", {
      threadID,
      body: this.chatInput && this.chatInput.value
    });
    this.setState({
      currentHistory: this.state.currentHistory.concat([
        {
          threadID,
          messageID: "tmp",
          body: this.chatInput && this.chatInput.value,
          type: "message",
          senderID: yourID,
          timestamp: Date.now()
        }
      ])
    });

    if (this.chatInput) this.chatInput.value = "";
  };

  makeAsUnread = () => {
    const { selectedThreadID, threadDict } = this.state;
    ipcRenderer.send("markAsRead", {
      threadID: this.state.selectedThreadID,
      read: false
    });

    this.setState({
      threadDict: {
        ...threadDict,
        [selectedThreadID]: { ...threadDict[selectedThreadID], unreadCount: 1 }
      }
    });
  };

  snooze = () => {
    console.log("snooze dude snooze");
  };

  scrollToBottom = () => {
    if (this.scrollview) {
      const scrollHeight = this.scrollview.scrollHeight;
      const height = this.scrollview.clientHeight;
      const maxScrollTop = scrollHeight - height;
      this.scrollview.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  };

  componentDidMount() {
    this.scrollToBottom();
    console.log("mountied");

    ipcRenderer.send("GET_CONTACTS");
    console.log("GET_CONTACTS");
    ipcRenderer.send("listen");
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }
  sendApproval(): void {
    ipcRenderer.send("loginApprovalResponse", this.state.loginApproval);

    // throw new Error("Method not implemented.");
  }

  render() {
    const {
      loginApproval,
      selectedThreadID,
      threadDict,
      currentHistory
    } = this.state;
    const selectedThread = threadDict[selectedThreadID];
    const ApprovalInput = (
      <>
        <label htmlFor="approval">Enter Login Approval Code:</label>
        <input
          type="text"
          name="approvalInput"
          id="approval"
          onKeyPress={({ key }) => key === "enter" && this.sendApproval()}
        />
      </>
    );

    const ThreadList = ({ list }: { list: thread[] }) => (
      <div className={styles.thread_list}>
        {list.map(({ threadID, name, participants, unreadCount }) => (
          <div
            key={threadID}
            onClick={() => this.openThread(threadID)}
            className={[
              styles.thread_item,
              threadID === this.state.selectedThreadID
                ? styles.thread_item_selected
                : "",
              unreadCount > 0 ? styles.thread_item_unread : ""
            ].join(" ")}
          >
            {name || participants.map(p => p.name).join(", ")}
          </div>
        ))}
      </div>
    );

    const SelectedThread = ({ selectedThread }: { selectedThread: thread }) =>
      selectedThread ? (
        <div className={styles.right_column_controls}>
          <div onClick={this.makeAsUnread} style={{ cursor: "pointer" }}>
            Mark as unread
          </div>
          {selectedThread.name}
          <div onClick={this.snooze} style={{ cursor: "pointer" }}>
            Snooze
          </div>
        </div>
      ) : null;

    const ChatWindow = ({ currentHistory }: { currentHistory: history[] }) => (
      <div
        className={styles.chat_window}
        ref={el => {
          this.scrollview = el;
        }}
      >
        {currentHistory.map(({ body, type, senderID, messageID }, i) =>
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
          )
        )}
      </div>
    );

    const ChatControls = () => (
      <div className={styles.chat_controls}>
        <input
          className={styles.chat_input}
          ref={el => {
            this.chatInput = el;
          }}
          onKeyPress={e => (e.key === "Enter" ? this.sendMessage() : null)}
        />
        <button className={styles.chat_send} onClick={this.sendMessage}>
          send
        </button>
      </div>
    );

    return loginApproval ? (
      ApprovalInput
    ) : (
      <div className={styles.container} data-tid="container">
        <div className={styles.left_column}>
          <ThreadList list={Object.values(this.state.threadDict)} />
        </div>
        <div className={styles.right_column}>
          <SelectedThread selectedThread={selectedThread} />
          <ChatWindow currentHistory={currentHistory} />
          <ChatControls />
        </div>
      </div>
    );
  }
}
