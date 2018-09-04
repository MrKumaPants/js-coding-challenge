import { IApp } from "./types";

import { App } from "./features/App/store";

export const createStores = (initialState: IApp) => {
  return {
    appStore: new App(initialState)
  };
};
