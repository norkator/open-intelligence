import React, {Component} from "react";
// import axios, {GET_LATEST_CAMERA_IMAGES_PATH} from '../../axios';

interface FacesInterface {
}

class Faces extends Component {
  private _isMounted: boolean;

  constructor(props: any) {
    super(props);
    this._isMounted = false;
  }

  componentDidMount(): void {
    this._isMounted = true;
  }

  componentWillUnmount(): void {
    this._isMounted = false;
  }

  render() {
    return (
      <div>
      </div>
    )
  }
}


export default Faces;
