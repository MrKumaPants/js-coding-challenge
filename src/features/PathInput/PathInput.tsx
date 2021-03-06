import * as React from "react";
import { observer } from "mobx-react";
import axios, { AxiosResponse } from "axios";
import * as _ from "lodash";

import { Button, Grid, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { FastField as Field, Formik, Form } from "formik";
import ReactJson from "react-json-view";

import { Parameter, Schema, PathParameter } from "swagger-schema-official";

import MaterialInput from "./MaterialInput";
import styles from "./styles";
import { IPathInputProps, IPathInputState } from "./types";

@observer
class PathInput extends React.Component<IPathInputProps, IPathInputState> {
  public state = {
    result: {} as AxiosResponse
  };

  private onSubmit = async (values: any) => {
    const { path } = this.props;

    let url = path.path;
    const params = {};
    const data = {};

    _.each(values, (value, key) => {
      const [type, param] = _.split(key, "_");

      if (type === "path") {
        url = _.replace(url, `{${param}}`, value);
      } else if (type === "query") {
        params[param] = value;
      } else if (type === "body") {
        data[param] = value;
      }
    });

    let result: AxiosResponse;
    try {
      result = await axios({
        method: path.operation,
        url,
        params: {
          ...axios.defaults.params,
          ...params
        },
        data
      });
      if (result.data === "") {
        result.data = {};
      }
    } catch (e) {
      result = e.response;
    }

    this.setState({ result });
  };

  private getParameters = (parameters: Parameter[]) => {
    const { classes } = this.props;
    return (
      <div>
        {_.map(parameters, (parameter: Parameter) => {
          return (
            <Field
              className={classes.textField}
              key={parameter.name}
              name={`${parameter.in}_${parameter.name}`}
              label={parameter.name}
              helperText={parameter.description ? parameter.description : null}
              required={parameter.required}
              type={"type" in parameter ? parameter.type : "string"}
              component={MaterialInput}
            />
          );
        })}
      </div>
    );
  };

  private getInitialValues = (parameters?: Parameter[]) => {
    if (!parameters) {
      return {};
    }
    const values = {};
    // Form fields need initial values to stay as controlled input
    // Since these are dynamic, we need to build this up
    _.each(parameters, (parameter: Parameter) => {
      const key = `${parameter.in}_${parameter.name}`;
      values[key] = "";
    });
    return values;
  };

  private transformParameters = (parameters?: Parameter[]) => {
    if (!parameters) {
      return [];
    }

    // Transform linked objects in parameters that contain schemas into flattened parameters
    return _.transform<any, PathParameter>(
      parameters,
      (result: PathParameter[], value: any, key: string) => {
        if (value && "schema" in value) {
          _.each(value.schema!.properties, (property: Schema, name: string) => {
            const parameter = {
              name,
              required: _.indexOf(value.schema.required, name) >= 0,
              in: value.in,
              type: _.isArray(property.type) ? property.type![0] : property.type
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
    const { result } = this.state;

    const parameters = this.transformParameters(path.parameters);
    const initialValues = this.getInitialValues(parameters);

    return (
      <div className={classes.root}>
        <Grid item xs={6}>
          <Formik
            initialValues={initialValues}
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
            {result.data ? (
              <Typography component="div">
                <ReactJson
                  src={result.data}
                  name={false}
                  displayDataTypes={false}
                />
              </Typography>
            ) : null}
          </div>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(PathInput);
