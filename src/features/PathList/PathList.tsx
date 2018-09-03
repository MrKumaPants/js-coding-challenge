import * as React from "react";
import * as _ from "lodash";

import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import withStyles from "@material-ui/core/styles/withStyles";

import styles from "./styles";
import { IPathListProps } from "./types";

import PathInput from "../PathInput";
import Responses from "../Responses";

const transformPaths = (paths: any) => {
  return _.transform(
    paths,
    (result: object, value: any, key: string) => {
      const operations = _.keys(_.omit(value, "parameters"));
      _.each(operations, (o: any) => {
        const operation = value[o];
        if (value.parameters) {
          if (operation.parameters) {
            operation.parameters = _.concat(
              operation.parameters,
              value.parameters
            );
          } else {
            operation.parameters = value.parameters;
          }
          console.log(operation.parameters);
        }
        result[operation.operationId] = {
          ...operation,
          operation: o,
          path: key
        };
      });
    },
    {}
  );
};

const PathList = (props: IPathListProps) => {
  const { classes, spec } = props;
  const transformedPaths = transformPaths(spec.paths);

  return (
    <div className={classes.root}>
      {_.map(transformedPaths, (path: any) => {
        return (
          <ExpansionPanel key={path.operationId}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>
                {path.summary}
              </Typography>
              <Typography className={classes.secondaryHeading}>
                {_.upperCase(path.operation)} {path.path}
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.details}>
              <PathInput path={path} />
              <Responses responses={path.responses} />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        );
      })}
    </div>
  );
};

export default withStyles(styles)(PathList);
