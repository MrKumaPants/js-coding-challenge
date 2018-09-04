import { WithStyles } from "@material-ui/core/styles";
import { Response } from "swagger-schema-official";

import styles from "./styles";

export interface IResponseProps extends WithStyles<typeof styles> {
  responses: Response[];
}
