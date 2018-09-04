import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";

export default (theme: Theme) =>
  createStyles({
    root: {
      align: "left",
      display: "flex"
    },
    button: {
      margin: theme.spacing.unit
    },
    paper: {
      height: "250px",
      width: "100%",
      margin: theme.spacing.unit,
      overflowY: "auto"
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: "200px"
    }
  });
