import * as React from "react";
import * as _ from "lodash";
import * as status from "http-status";

import { Chip, Tooltip, Typography } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import ReactJson from "react-json-view";

import styles from "./styles";

const getTooltip = (code: string, response: any) => {
  let examples = response.examples ? response.examples["application/json"] : {};
  if (_.isArray(examples)) {
    examples = [examples[0]];
  }
  return (
    <div>
      <Typography variant="subheading">{status[code]}</Typography>
      <Typography color="textSecondary">Example</Typography>
      <Typography component="div">
        <ReactJson
          src={examples}
          name={false}
          indentWidth={2}
          enableClipboard={false}
          displayDataTypes={false}
        />
      </Typography>
    </div>
  );
};

const responseColor = (code: string) => {
  const codeNumber = _.toNumber(code);
  if (codeNumber >= 200 && codeNumber < 300) {
    return "primary";
  } else if (codeNumber >= 400) {
    return "secondary";
  }
  return "default";
};

const Responses = (props: any) => {
  const { classes, responses } = props;

  return (
    <div>
      {_.map(_.keys(responses), (code: any) => {
        const color = responseColor(code);
        return (
          <Tooltip
            key={code}
            title={getTooltip(code, responses[code])}
            classes={{ tooltip: classes.tooltip }}
          >
            <Chip label={code} className={classes.chip} color={color} />
          </Tooltip>
        );
      })}
    </div>
  );
};

export default withStyles(styles)(Responses);