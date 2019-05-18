const threadForUser = (mes: any, username: string) => {
  return mes.store.users
    .getUser({ name: username })
    .then(({ id, name }: { id: number; name: string }) => {
      if (!name) throw new Error();
      return {
        threadID: id,
        name
      };
    });
};

export type apiHandler = {
  [resource: string]: Function | undefined;
  get?: Function;
  post?: Function;
};

export interface ResourceToCommandMapper {
  [resource: string]: apiHandler;
}

export const resourceToRequest = (mes: any) => {
  return {
    contacts: {
      /**
       * @param {(err, success)=>any} cb
       */
      get: (payload: {}) => {
        return new Promise((resolve, reject) =>
          mes.store.users.me ? resolve(mes.store) : reject(undefined)
        );
      }
    },
    messages: {
      get: ({ username, count }: { username: string; count: number }) => {
        const { threadID, name } = threadForUser(mes, username);
        return new Promise((resolve, reject) => {
          mes.api.getThreadHistory(
            threadID,
            count,
            undefined,
            (err: any, history: any) => {
              if (err) return reject(err);
              resolve(history);

              // mes.store.users.getUsers();
            }
          );
        });
      }
    },
    threads: {}
  };
};
