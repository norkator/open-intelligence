import React, {Component} from "react";
import {Card} from "react-bootstrap";
import {
  FacesInterface,
  getFaces, tryFaceDetectionAgain,
} from "../../../utils/HttpUtils";
import {ReduxPropsInterface} from "../../../store/reducers/dateReducer";
import {connect} from "react-redux";
import styles from './FaceIdentity.module.css'


class FaceIdentity extends Component<ReduxPropsInterface> {
  state = {
    faceDetections: [] as FacesInterface[]
  };

  componentDidMount(): void {
    this.getFaces().then(() => null);
  }

  async getFaces() {
    const faces = await getFaces(this.props.selectedDate) as FacesInterface[];
    this.setState({faceDetections: faces})
  }

  render() {
    let faces: JSX.Element[] = [];

    if (this.state.faceDetections !== undefined) {
      if (this.state.faceDetections.length > 0) {
        faces = this.state.faceDetections.map(face => {
          return (
            <div key={face.id}
                 className={styles.zoom}
                 style={{cursor: 'pointer'}}
                 onClick={async () => await this.onFaceClickHandler(face.id)}>
              <Card style={{maxWidth: '90px'}} className="mr-1 mt-1 ml-1 mb-1">
                <Card.Img variant="top" src={face.image} style={{maxHeight: '120px'}}/>
                <Card.Body className="p-2">
                  <Card.Title className="m-0">
                    <small>{face.detectionResult}</small>
                  </Card.Title>
                </Card.Body>
                <Card.Footer className="p-2">
                  <small className="text-muted">{face.title}</small>
                </Card.Footer>
              </Card>
            </div>
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
            <div className="d-flex justify-content-center flex-wrap">
              {faces}
            </div>
          </Card.Body>
          <Card.Footer className="p-2">
            <small className="text-muted">Face identification result are mostly indicative and may not be
              accurate</small>
          </Card.Footer>
        </Card>
      </div>
    )
  }


  async onFaceClickHandler(id: string) {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Try detection again for this image?")) {
      const result = await tryFaceDetectionAgain(id);
      // eslint-disable-next-line no-restricted-globals
      alert(result);
    }
  }

}

const mapStateToProps = (state: any): any => {
  return {
    selectedDate: state.dateReducer.selectedDate,
  };
};

export default connect(mapStateToProps)(FaceIdentity);


