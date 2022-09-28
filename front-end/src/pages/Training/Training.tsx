import React, {Component} from "react";
import PlateTraining from "./PlateTraining/PlateTraining";
import PersonTraining from "./PersonTraining/PersonTraining";
import ErrorComponent from "../../components/NetworkErrorComponent/ErrorComponent";
import FaceIdentity from "./FaceIdentity/FaceIdentity";
import {ReduxPropsInterface} from "../../store/reducers/dateReducer";
import {CommonPropsInterface} from "../../store/reducers/commonReducer";

class Training extends Component<ReduxPropsInterface & CommonPropsInterface> {

  componentDidMount(): void {
  }

  render() {
    return (
      <div>
        <ErrorComponent/>
        <div className="mt-2 mr-2 ml-2">
          <PlateTraining/>
        </div>
        <div className="mt-2 mr-2 ml-2">
          <PersonTraining/>
        </div>
        <div className="mt-2 mr-2 ml-2">
          <FaceIdentity {...this.props} />
        </div>
      </div>
    )
  }
}


export default Training;
