import * as React from "react";
import { inject, observer } from "mobx-react";
import { IAppProps, IAppState } from "./types";

const logo = require("../../../public/icon.png");
const appStyles = require("./styles.css");

import PathList from "../PathList";

@inject("appStore")
@observer
class App extends React.Component<IAppProps, IAppState> {
  public render() {
    const { appStore } = this.props;

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
