import * as React from "react";
import axios from "axios";
import * as _ from "lodash";

import { Button, Grid, TextField, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { FastField as Field, Formik, Form } from "formik";
import ReactJson from "react-json-view";

import styles from "./styles";

interface IPathInputState {
  loading: boolean;
  result: any;
}

const MaterialInput = ({
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

class PathInput extends React.Component<any, IPathInputState> {
  state = {
    loading: false,
    result: {} as any
  };

  private onSubmit = async (values: any, actions: any) => {
    const { path } = this.props;

    let url = path.path;
    const params = {};
    const data = {};

    _.each(values, (value, key) => {
      const inValue = _.split(key, "_");

      if (inValue[0] === "path") {
        url = _.replace(url, `{${inValue[1]}}`, value);
      } else if (inValue[0] === "query") {
        params[inValue[1]] = value;
      } else if (inValue[0] === "body") {
        data[inValue[1]] = value;
      }
    });

    this.setState({ loading: true });

    let result;
    try {
      result = await axios({
        method: path.operation,
        url,
        params,
        data
      });
    } catch (e) {
      result = e.response;
    }

    this.setState({ loading: false, result });
  };

  private getParameters = (parameters: any) => {
    const { classes } = this.props;
    return (
      <div>
        {_.map(parameters, parameter => {
          return (
            <Field
              className={classes.textField}
              name={`${parameter.in}_${parameter.name}`}
              label={parameter.name}
              helperText={parameter.description ? parameter.description : null}
              required={parameter.required}
              type={parameter.type}
              component={MaterialInput}
            />
          );
        })}
      </div>
    );
  };

  private transformParameters = (parameters: any) => {
    return _.transform(
      parameters,
      (result: Array<object>, value: any, key: string) => {
        if (value.schema) {
          _.each(value.schema.properties, (property, name) => {
            const parameter = {
              name,
              required: _.find(value.required, name) ? true : false,
              in: value.in
            };
            result.push(parameter);
          });
        } else {
          result.push(value);
        }
      },
      []
    );
  };

  public render() {
    const { classes, path } = this.props;
    const { loading, result } = this.state;

    const parameters = this.transformParameters(path.parameters);

    return (
      <div className={classes.root}>
        <Grid item xs={6}>
          <Formik
            initialValues={{}}
            onSubmit={this.onSubmit}
            render={(formik: any) => (
              <Form>
                {this.getParameters(parameters)}
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  type="submit"
                >
                  Submit
                </Button>
              </Form>
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <div className={classes.paper}>
            <Typography component="div">
              {!loading && result.data ? (
                <ReactJson
                  src={result.data}
                  name={false}
                  displayDataTypes={false}
                />
              ) : null}
            </Typography>
          </div>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(PathInput);
