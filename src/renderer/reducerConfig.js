import { toObjectKeyedOn } from "./utils";

const apiResources = [
  { id: "friendsList" },
  { id: "threadList", defaultArgs: [20, null, []] },
  { id: "threadHistory", argIds: ["threadId", "ammount", "timestamp"] },
  { id: "message", argIds: ["body", "threadID", "read"] }
];

const reqTypeTranslator = {
  send: "send",
  get: "get",
  patch: undefined,
  subscribe: "listen"
};

// const modes = ["success", "failure", "pending"];
// const requestType = ["get", "post", "patch"];

export const reducer = (state, action) => {
  const { type, payload } = action;
  const [rType, resource, mode] = type.split("_");
  if (rType === "get" && mode === "success") {
    state[resource] = payload.data;
  }
};

const reduxTypeToFBAPI = type => {
  const [reqType, resource, mode] = type.split("_");
  const prefix = reqTypeTranslator[reqType];
  const apiCall = prefix
    ? prefix + resource[0].toUpperCase() + resource.slice(1)
    : reqType === "patch"
    ? "markAsRead"
    : "listen";
  return apiCall;
};

const fbAPIToIPCConnector = apiAction => (dispatch, api) => [
  apiAction,
  (event, action) => {
    const { type, payload } = action || {
      type: undefined,
      payload: undefined
    };
    apiAction;
    const argList = payload.args || [];

    api[apiAction](...argList, (err, data) => {
      if (err) {
        console.error(apiAction, err);
        const failType = [type, ipcModes[2]].join("_");
        // log errors in the redux store as well
        dispatch({ type: failType, payload: err });
        return;
      }
      // instead of using the event callback, we'll use redux to handle this
      // event.sender.send(apiAction, data);
      const successType = [type, ipcModes[1]].join("_");
      dispatch({ type: successType, payload: data });
    });
  }
];

const initIPCFBHandlers = apiActions => (ipcMain, api, dispatch) => {
  apiActions
    .map(fbAPIHandlerFactory)
    .forEach(([actionType, preHandler]) =>
      ipcMain.on(actionType, preHandler(dispatch, api))
    );
};

const apiActions = [
  "getFriendsList",
  "getThreadList",
  "getThreadHistory",
  "sendMessage",
  "markAsRead",
  "listen"
];

export const initFacebookHandlers = initIPCFBHandlers(apiActions);
