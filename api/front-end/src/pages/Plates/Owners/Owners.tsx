import React, {Component} from "react";
import {ReduxPropsInterface} from "../../../store/reducer";

class Owners extends Component<ReduxPropsInterface> {

  render() {
    return (
      <div>
        Vehicle owner connections (license plate + Owner name)
      </div>
    )
  }
}

export default Owners;
