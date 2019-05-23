export declare function index(loginData: any, callback: any): void;
export declare function index(
  loginData: any,
  options: any,
  callback: any
): void;

type callbackType = (err: any, data: any) => any;
type threadListTags =
  | ["INBOX"]
  | ["ARCHIVED"]
  | ["PENDING"]
  | ["OTHER"]
  | ["INBOX", "unread"]
  | ["ARCHIVED", "unread"]
  | ["PENDING", "unread"]
  | ["OTHER", "unread"];

export type FBAPI = {
  addUserToGroup(
    userID: string,
    threadID: string,
    callback: callbackType
  ): void;
  changeAdminStatus(
    threadID: string,
    adminIDs: string[],
    adminStatus: any,
    callback: callbackType
  ): void;
  changeArchivedStatus(
    threadOrThreads: any,
    archive: any,
    callback: callbackType
  ): void;
  changeBlockedStatus(
    userID: string,
    block: Boolean,
    callback: callbackType
  ): void;
  changeGroupImage(
    image: string,
    threadID: string,
    callback: callbackType
  ): void;
  changeNickname(
    nickname: string,
    threadID: string,
    participantID: string,
    callback: callbackType
  ): void;
  changeThreadColor(
    color: string,
    threadID: string,
    callback: callbackType
  ): void;
  changeThreadEmoji(
    emoji: string,
    threadID: string,
    callback: callbackType
  ): void;
  createPoll(
    title: string,
    threadID: string,
    options: {},
    callback: callbackType
  ): void;
  deleteMessage(
    messageOrMessages: string | string[],
    callback: callbackType
  ): void;
  deleteThread(
    threadOrThreads: string | string[],
    callback: callbackType
  ): void;
  forwardAttachment(
    attachmentID: string,
    userOrUsers: string | string[],
    callback: callbackType
  ): void;
  getCurrentUserID(): void;
  getEmojiUrl(c: string, size: number, pixelRatio: string): void;
  getFriendsList(callback: callbackType): void;
  getThreadHistory(
    threadID: string,
    amount: number,
    timestamp: number | null,
    callback: callbackType
  ): void;
  getThreadInfoGraphQL(threadID: string, callback: callbackType): void;
  getThreadInfo(threadID: string, callback: callbackType): void;
  getThreadList(
    limit: number,
    timestamp: number | null,
    tags: threadListTags,
    callback: callbackType
  ): void;
  // getThreadList(start:number, end:number, type, callback:callbackType,):void
  getThreadPictures(
    threadID: string,
    offset: number,
    limit: number,
    callback: callbackType
  ): void;
  getUserID(name: string, callback: callbackType): void;
  getUserInfo(id: string, callback: callbackType): void;
  handleMessageRequest(
    threadID: string,
    accept: boolean,
    callback: callbackType
  ): void;
  logout(callback: callbackType): void;
  markAsRead(threadID: string, read: boolean, callback: callbackType): void;
  muteThread(
    threadID: string,
    muteSeconds: number,
    callback: callbackType
  ): void;
  removeUserFromGroup(
    userID: string,
    threadID: string,
    callback: callbackType
  ): void;
  resolvePhotoUrl(photoID: string, callback: callbackType): void;
  searchForThread(name: string, callback: callbackType): void;
  sendMessage(msg: string, threadID: string, callback: callbackType): void;
  sendTypingIndicator(threadID: string, callback: callbackType): void;
  setMessageReaction(
    reaction: string,
    messageID: string,
    callback: callbackType
  ): void;
  setTitle(newTitle: string, threadID: string, callback: callbackType): void;
  unsendMessage(messageID: string, callback: callbackType): void;
};
