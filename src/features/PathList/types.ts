import { WithStyles } from "@material-ui/core/styles";
import { Operation } from "swagger-schema-official";
import styles from "./styles";
import { ISpec } from "../App/types";

export interface IPathListProps extends WithStyles<typeof styles> {
  spec: ISpec;
}

export interface TransformedPath extends Operation {
  operation: string;
  path: string;
}
