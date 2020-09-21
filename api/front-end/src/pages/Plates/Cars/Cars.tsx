import React, {Component} from "react";
import {ReduxPropsInterface} from "../../../store/dateReducer";

class Cars extends Component<ReduxPropsInterface> {

  render() {
    return (
      <div>
        Date range selector component and Cars view
      </div>
    )
  }
}

export default Cars;
