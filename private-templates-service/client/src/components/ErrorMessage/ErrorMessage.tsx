import React from "react";
import { Alert } from "reactstrap";

export interface ErrorMessageProps {
  debug?: string;
  message?: string;
}

export default class ErrorMessage extends React.Component<ErrorMessageProps> {
  render = () => (
    <Alert color="danger">
      <p className="mb-3">{this.props.message}</p>
      {this.props.debug && <pre className="alert-pre border bg-light p-2">
        <code>{this.props.debug}</code>
      </pre>}
    </Alert>
  );
}
