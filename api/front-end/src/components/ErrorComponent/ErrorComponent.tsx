import React, {Component} from "react";
import {connect} from "react-redux";
import ErrorIndicator from "./ErrorIndicator/ErrorIndicator";

class ErrorComponent extends Component<any> {
  render() {
    return (
      <div>
        {this.props.axiosError !== null ?
          <ErrorIndicator axiosError={this.props.axiosError}/> : null}
      </div>
    )
  }
}

const mapStateToProps = (state: any): any => {
  return {
    axiosError: state.commonReducer.axiosError,
  };
};

export default connect(mapStateToProps)(ErrorComponent);
