import * as React from "react";
import * as ReactDOM from "react-dom";

interface IFormFields {
    value?: string;
    isValid: boolean;
}

class Form extends React.Component<{}, IFormFields> {
    public constructor(props) {
        super(props);
        this.state = {
            value: "",
            isValid: false,
        };
    }
    public render(): React.ReactNode {
        return (
            <form action="analyse" method="POST">
                <div className="form-group">
                    <input className="form-control" name="url" type="text" placeholder="https://www.google.com/"
                        value={this.state.value}
                        onChange={(e) => this.userInput(e)}/>
                </div>
                <div className="form-group">
                    <input className="form-control" type="submit" disabled={!this.state.isValid}/>
                </div>
            </form>
        );
    }
    private userInput(event: React.ChangeEvent): void {
        const fieldValue = (event.target as HTMLInputElement).value;
        this.setState({value: fieldValue, isValid: fieldValue.length !== 0});
    }
}

const container = document.querySelector("#formContainer");
ReactDOM.render(React.createElement(Form), container);
