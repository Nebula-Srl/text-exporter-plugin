// storage.ts
export const Storage = {
  get: (key: string): Promise<any> => {
    return new Promise((resolve) => {
      const handler = (event: MessageEvent) => {
        if (
          event.data.pluginMessage?.type === "storageValue" &&
          event.data.pluginMessage.key === key
        ) {
          window.removeEventListener("message", handler);
          resolve(event.data.pluginMessage.value);
        }
      };
      window.addEventListener("message", handler);
      parent.postMessage(
        {
          pluginMessage: {
            type: "getStorage",
            key,
          },
        },
        "*"
      );
    });
  },

  set: (key: string, value: any): Promise<void> => {
    return new Promise((resolve) => {
      parent.postMessage(
        {
          pluginMessage: {
            type: "setStorage",
            key,
            value,
          },
        },
        "*"
      );
      resolve();
    });
  },

  delete: (key: string): Promise<void> => {
    return new Promise((resolve) => {
      parent.postMessage(
        {
          pluginMessage: {
            type: "deleteStorage",
            key,
          },
        },
        "*"
      );
      resolve();
    });
  },
};
