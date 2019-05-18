import { ipcMain, BrowserWindow } from "electron";
import fbchat from "facebook-chat-api";
import fs from "fs";
import { Messen } from "messen";
import util from "util";
import {
  resourceToRequest,
  ResourceToCommandMapper,
  apiHandler
} from "../common/resources";

const getCreds = () => {
  try {
    const appState = JSON.parse(fs.readFileSync("appstate.json").toString());
    return { appState };
  } catch (err) {
    const credentials = JSON.parse(
      fs.readFileSync("src/credentials.json").toString()
    );
    return credentials;
  }
};

let mes: Messen;
mes = new Messen({ dir: "credentials" });

const genericHandling: apiHandler = {
  get: (actionType: string, handler: ({}) => Promise<any>) => (
    event: any,
    payload: {}
  ) => {
    const [command, resource] = actionType.split("_");
    handler(payload).then(val => event.sender.send("RCV_" + actionType, val));
  },
  post: () => undefined
};

const bindActionsToIPC = (resourceToRequest: ResourceToCommandMapper) => {
  for (const k in resourceToRequest) {
    const resource = resourceToRequest[k];
    for (const command in resource) {
      const actionType = [command, k].map(w => w.toUpperCase()).join("_");
      const genericHandlerForCommand = genericHandling[command];
      const resourceHandler = resource[command] || undefined;
      if (genericHandlerForCommand && resourceHandler)
        ipcMain.on(
          actionType,
          genericHandlerForCommand(actionType, resourceHandler)
        );
    }
  }
};

/**
 * grammar looks like COMMAND_RESOURCE
 * eg, GET_CONTACTS
 */

// api interface  = ...args, cb

export const initFBChat = (window: BrowserWindow) => {
  const creds = getCreds();
  mes.login(creds).then(ev => {
    bindActionsToIPC(resourceToRequest(mes));

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
