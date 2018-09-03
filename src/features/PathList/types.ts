import { WithStyles } from "@material-ui/core/styles";
import styles from "./styles";
import { ISpec } from "../../types";

export interface IPathListProps extends WithStyles<typeof styles> {
  spec: ISpec;
}
