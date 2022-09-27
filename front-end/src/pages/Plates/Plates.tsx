import React, {Component} from "react";
import Cars from "./Cars/Cars";
import {connect} from "react-redux";
import {ReduxPropsInterface} from "../../store/reducers/dateReducer";
import Owners from "./Owners/Owners";
import ErrorComponent from "../../components/NetworkErrorComponent/ErrorComponent";
import {CommonPropsInterface} from "../../store/reducers/commonReducer";

class Plates extends Component<ReduxPropsInterface & CommonPropsInterface> {
  render() {
    return (
      <div>
        <ErrorComponent/>
        <div className="mt-2 mr-2 ml-2">
          <Cars {...this.props}/>
        </div>
        <div className="mt-2 mr-2 ml-2">
          <Owners {...this.props} />
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state: any): any => {
  return {};
};

export default connect(mapStateToProps)(Plates);

