import React, {Component} from "react";
import {connect} from "react-redux";
import NetworkErrorIndicator from "./NetworkErrorIndicator/NetworkErrorIndicator";
import {WithTranslation, withTranslation} from "react-i18next";
import {ReduxPropsInterface} from "../../store/reducers/dateReducer";

class ErrorComponent extends Component<ReduxPropsInterface & WithTranslation & any> {
  render() {
    const {t} = this.props;
    return (
      <div>
        {this.props.axiosError !== null ?
          <NetworkErrorIndicator t={t} axiosError={this.props.axiosError}/> : null}
      </div>
    )
  }
}

const mapStateToProps = (state: any): any => {
  return {
    axiosError: state.commonReducer.axiosError,
  };
};

export default connect(mapStateToProps)(withTranslation('i18n')(ErrorComponent));
