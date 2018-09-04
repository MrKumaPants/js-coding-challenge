import * as React from "react";
import * as _ from "lodash";

import { MenuItem, TextField } from "@material-ui/core";

const booleanValues = [
  {
    value: "false",
    label: "false"
  },
  {
    value: "true",
    label: "true"
  }
];

export default ({
  field: { ...fields },
  form: { touched, errors, ...rest },
  ...props
}: any) => {
  const fullProps = {
    ...props,
    ...fields,
    error: Boolean(touched[fields.name] && errors[fields.name]),
    helperText: touched[fields.name] && errors[fields.name]
  };
  if (props.type === "boolean") {
    return (
      <TextField select {...fullProps}>
        {_.map(booleanValues, (option: any) => {
          return (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          );
        })}
      </TextField>
    );
  }
  return <TextField {...fullProps} />;
};
