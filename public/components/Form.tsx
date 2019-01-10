import * as React from "react";
import * as ReactDOM from "react-dom";

class Form extends React.Component {
    public constructor(props) {
        super(props);
    }
    public render(): React.ReactNode {
        return (
            <form action="analyse" method="POST">
                <div className="form-group">
                    <input className="form-control" name="url" type="text" placeholder="https://www.google.com/" />
                </div>
                <div className="form-group">
                    <input className="form-control" type="submit" />
                </div>
            </form>
        );
    }
}

const container = document.querySelector("#formContainer");
ReactDOM.render(React.createElement(Form), container);
