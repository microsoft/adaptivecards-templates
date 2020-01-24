import React from "react";
import { Alert } from "reactstrap";

interface Props {
	debug: any;
	message: any;
}

export default class ErrorMessage extends React.Component<Props> {
	render() {
		let debug = null;
		if (this.props.debug) {
			debug = (
				<pre className="alert-pre border bg-light p-2">
					<code>{this.props.debug}</code>
				</pre>
			);
		}
		return (
			<Alert color="danger">
				<p className="mb-3">{this.props.message}</p>
				{debug}
			</Alert>
		);
	}
}
