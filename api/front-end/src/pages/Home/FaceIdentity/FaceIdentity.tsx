import React, {Component} from "react";
import {Card} from "react-bootstrap";
import {getInstanceDetails, InstanceInterface} from "../../../utils/HttpUtils";
import {ReduxPropsInterface} from "../../../store/reducers/dateReducer";


class FaceIdentity extends Component<ReduxPropsInterface> {
  state = {
    faceDetections: []
  };

  componentDidMount(): void {

  }

  async loadInstanceDetails() {
    const instances = await getInstanceDetails() as InstanceInterface;
    this.setState({instances: instances})
  }

  render() {
    let faces: JSX.Element[] = [];

    if (this.state.faceDetections !== undefined) {
      if (this.state.faceDetections.length > 0) {
        faces = this.state.faceDetections.map(face => {
          return (
            <div></div>
          );
        });
      }
    }

    return (
      <div>
        <Card bg="light" text="dark">
          <Card.Header>
            Face identifications
          </Card.Header>
          <Card.Body style={{padding: '0px'}}>
            {faces}
          </Card.Body>
          <Card.Footer className="p-2">
            <small className="text-muted">Face identification result are mostly indicative and may not be accurate</small>
          </Card.Footer>
        </Card>
      </div>
    )
  }
}


export default FaceIdentity;

