import * as React from "react";
import { inject, observer } from "mobx-react";
import { IAppProps, IAppState } from "./types";

const logo = require("../public/icon.png");
const appStyles = require("./styles/App.css");

import PathList from "./features/PathList";

@inject("appStore")
@observer
class App extends React.Component<IAppProps, IAppState> {
  public render() {
    const { appStore } = this.props;

    console.log("Here's the spec:", appStore);

    return (
      <div className={appStyles.app}>
        <div className={appStyles.appHeader}>
          <img src={logo} className={appStyles.appLogo} alt="logo" />
          <h1>Stoplight Coding Challenge</h1>
        </div>
        <PathList spec={appStore.spec} />
      </div>
    );
  }
}

export default App;
