const { ipcMain } = require("electron");
const fbchat = require("facebook-chat-api");
const fs = require("fs");

const getCreds = () => {
  try {
    const appState = JSON.parse(fs.readFileSync("src/appstate.json"));
    return { appState };
  } catch (err) {
    const credentials = JSON.parse(fs.readFileSync("src/credentials.json"));
    return credentials;
  }
};

const initFBChat = window => {
  return fbchat(getCreds(), (err, api) => {
    if (err) {
      switch (err.error) {
        case "login-approval":
          console.log("Enter code > ");
          window.webContents.send("loginApproval");
          break;
        default:
          console.error(err);
      }
      return;
    }
    // dasApi = api;
    fs.writeFileSync("appstate.json", JSON.stringify(api.getAppState()));
    ipcMain.on("getFriendsList", event => {
      api.getFriendsList((err, data) => {
        if (err) {
          console.error("getFriendsList", err);
          return;
        }
        event.sender.send("getFriendsListResponse", data);
      });
    });
    ipcMain.on("getThreadList", event => {
      console.log("getThreadList");
      api.getThreadList(20, null, [], (err, data) => {
        if (err) {
          console.error("getThreadList", err);
          return;
        }
        event.sender.send("getThreadListResponse", data);
      });
    });
    ipcMain.on("getThreadHistory", (event, args) => {
      console.log("getThreadHistory");
      api.getThreadHistory(
        args.threadID,
        args.amount,
        args.timestamp,
        (err, data) => {
          if (err) {
            console.error("getThreadHistory", err);
            return;
          }
          event.sender.send("getThreadHistoryResponse", data);
        }
      );
    });
    ipcMain.on("sendMessage", (event, args) => {
      let now = Date.now();
      console.log("sendMessage", now);
      api.sendMessage(args.body, args.threadID, (err, data) => {
        if (err) {
          console.error("sendMessage", err);
          return;
        }
        console.log("timestamp - now = ", data.timestamp - now);
        event.sender.send("sendMessageResponse", data);
      });
    });
    ipcMain.on("markAsRead", (event, args) => {
      console.log("markAsRead");
      api.markAsRead(args.threadID, args.read, (err, data) => {
        if (err) {
          console.error("markAsRead", err);
          return;
        }
        // event.sender.send('sendMessageResponse', data);
      });
    });
    ipcMain.on("listen", (event, args) => {
      api.listen((err, data) => {
        if (err) {
          console.error("listen", err);
          return;
        }
        event.sender.send("message", data);
      });
    });
  });
};

module.exports = { initFBChat };
