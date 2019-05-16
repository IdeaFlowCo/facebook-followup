const { ipcMain } = require("electron");
const fbchat = require("facebook-chat-api");
const fs = require("fs");
const { Messen } = require("messen");
const util = require("util");

const getCreds = () => {
  try {
    const appState = JSON.parse(fs.readFileSync("appstate.json"));
    return { appState };
  } catch (err) {
    const credentials = JSON.parse(fs.readFileSync("src/credentials.json"));
    return credentials;
  }
};
let mes;
mes = new Messen({ dir: "credentials" });

const createNewThreadForUser = (mes, username) => {
  mes.store.users.getUser({ name: username }).then(user => {
    if (!user) throw new Error();
    return {
      threadID: user.id,
      name: user.name
    };
  });
};

/**
 * grammar looks like COMMAND_RESOURCE
 * eg, GET_CONTACTS
 */

// api interface  = ...args, cb

const resourceToRequest = {
  contacts: {
    /**
     * @param {(err, success)=>any} cb
     */
    get: payload => {
      return new Promise((resolve, reject) =>
        mes.store.users.me
          ? resolve(mes.store.users.me.friends)
          : reject(undefined)
      );
    }
  },
  history: {
    get: ({ username, count }) => {
      const thread = createNewThreadForUser(username);
      return new Promise((resolve, reject) => {
        mes.api.getThreadHistory(
          thread.threadID,
          count,
          undefined,
          (err, history) => {
            if (err) return reject(err);
            resolve(history);

            // mes.store.users.getUsers();
          }
        );
      });
    }
  }
};

const genericHandling = {
  get: (actionType, handler) => (event, payload) => {
    console.log(actionType, handler);

    handler(payload).then(val => event.sender.send("RCV_" + actionType, val));
  }
};

bindActionsToIPC = resourceToRequest => {
  for (const k in resourceToRequest) {
    const resource = resourceToRequest[k];
    for (const command in resource) {
      const actionType = [command, k].map(w => w.toUpperCase()).join("_");
      ipcMain.on(
        actionType,
        genericHandling[command](actionType, resource[command])
      );
    }
  }
};

const initFBChat = window => {
  const creds = getCreds();
  mes.login(creds).then(ev => {
    bindActionsToIPC(resourceToRequest);

    mes.listen();
  });

  mes.onMessage = event => {
    console.log(event);
  };
};
// return fbchat(creds, (err, api) => {
//   if (err) {
//     switch (err.error) {
//       case "login-approval":
//         console.log("Enter code > ");
//         window.webContents.send("loginApproval");
//         break;
//       default:
//         console.error(err);
//     }
//     return;
//   }
//   // dasApi = api;
//   fs.writeFileSync("appstate.json", JSON.stringify(api.getAppState()));
//   ipcMain.on("getFriendsList", event => {
//     api.getFriendsList((err, data) => {
//       if (err) {
//         console.error("getFriendsList", err);
//         return;
//       }
//       event.sender.send("getFriendsListResponse", data);
//     });
//   });
//   ipcMain.on("getThreadList", event => {
//     console.log("getThreadList");
//     //   api.getThreadList(20, null, [], (err, data) => {
//     //     if (err) {
//     //       console.error("getThreadList", err);
//     //       return;
//     //     }
//     //     event.sender.send("getThreadListResponse", data);
//     //   });
//   });
//   ipcMain.on("getThreadHistory", (event, args) => {
//     console.log("getThreadHistory");
//     api.getThreadHistory(
//       args.threadID,
//       args.amount,
//       args.timestamp,
//       (err, data) => {
//         if (err) {
//           console.error("getThreadHistory", err);
//           return;
//         }
//         event.sender.send("getThreadHistoryResponse", data);
//       }
//     );
//   });
//   ipcMain.on("sendMessage", (event, args) => {
//     let now = Date.now();
//     console.log("sendMessage", now);
//     api.sendMessage(args.body, args.threadID, (err, data) => {
//       if (err) {
//         console.error("sendMessage", err);
//         return;
//       }
//       console.log("timestamp - now = ", data.timestamp - now);
//       event.sender.send("sendMessageResponse", data);
//     });
//   });
//   ipcMain.on("markAsRead", (event, args) => {
//     console.log("markAsRead");
//     api.markAsRead(args.threadID, args.read, (err, data) => {
//       if (err) {
//         console.error("markAsRead", err);
//         return;
//       }
//       // event.sender.send('sendMessageResponse', data);
//     });
//   });
//   ipcMain.on("listen", (event, args) => {
//     api.listen((err, data) => {
//       if (err) {
//         console.error("listen", err);
//         return;
//       }
//       event.sender.send("message", data);
//     });
//   });
// });
// };

module.exports = { initFBChat };
