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

import { Operation, Path } from "swagger-schema-official";

import styles from "./styles";
import { IPathListProps, TransformedPath } from "./types";

import PathInput from "../PathInput";
import Responses from "../Responses";

const transformPaths = (paths: { [pathName: string]: Path }) => {
  return _.transform(
    paths,
    (
      result: { [operationid: string]: TransformedPath },
      value: Path,
      key: string
    ) => {
      const operations = _.keys(_.omit(value, "parameters"));
      _.each(operations, (o: any) => {
        const operation = value[o] as Operation;
        if (value.parameters) {
          if (operation.parameters) {
            operation.parameters = _.concat(
              operation.parameters,
              value.parameters
            );
          } else {
            operation.parameters = value.parameters;
          }
        }
        result[operation.operationId as string] = {
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
