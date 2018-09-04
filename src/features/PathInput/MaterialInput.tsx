import * as React from "react";

import { TextField } from "@material-ui/core";

export default ({
  field: { ...fields },
  form: { touched, errors, ...rest },
  ...props
}: any) => {
  return (
    <TextField
      {...props}
      {...fields}
      error={Boolean(touched[fields.name] && errors[fields.name])}
      helperText={touched[fields.name] && errors[fields.name]}
    />
  );
};
