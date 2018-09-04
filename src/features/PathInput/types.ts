import { AxiosResponse } from "axios";

import { WithStyles } from "@material-ui/core/styles";
import styles from "./styles";
import { TransformedPath } from "../PathList/types";

export interface IPathInputProps extends WithStyles<typeof styles> {
  path: TransformedPath;
}

export interface IPathInputState {
  result: AxiosResponse;
}
