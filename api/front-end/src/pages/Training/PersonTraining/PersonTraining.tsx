import React, {Component} from "react";
import {Button, Card, Col, Row} from "react-bootstrap";
import {
  FaceGroupingData,
  FaceGroupingImagesInterface, FaceGroupingNamesInterface,
  getFaceGroupingImages,
} from "../../../utils/HttpUtils";
import {LoadingIndicator} from "../../../components/LoadingIndicator/LoadingIndicator";


class PersonTraining extends Component<any, any> {
  state = {
    isLoading: true,
    faceGroupingNames: [] as FaceGroupingNamesInterface[],
    faceGroupingImages: [] as FaceGroupingImagesInterface[],
  };

  componentDidMount(): void {
    this.loadFaceGroupingImages().then(() => null);
  }

  async loadFaceGroupingImages() {
    const faceGroupingData = await getFaceGroupingImages() as FaceGroupingData;
    this.setState({
      isLoading: false,
      faceGroupingNames: faceGroupingData.names,
      faceGroupingImages: faceGroupingData.images,
    });
  }


  render() {
    let faceImages: JSX.Element[] = [];

    if (this.state.faceGroupingImages !== undefined) {
      if (this.state.faceGroupingImages.length > 0) {
        faceImages = this.state.faceGroupingImages.map(image => {
          return (
            <img
              id={image.file}
              title={image.title}
              className="CursorPointer mr-1 ml-1 mt-1 magictime spaceInLeft"
              style={{maxHeight: '120px', maxWidth: '120px', width: 'auto', height: 'auto'}}
              key={image.file}
              src={image.image}
              alt={image.file}
              onClick={() => this.faceGroupingFaceImageClickHandler(image.file)}
            />
          )
        });
      }
    }


    return (
      <div>
        <div className="magictime vanishIn">
          <Card bg="Light" text="dark">
            <Card.Header>
              <b>Person grouping and training</b>
            </Card.Header>
            <Card.Body className="d-flex flex-column align-items-center" style={{padding: '5px'}}>
              <div className="d-flex flex-wrap mt-2 mb-2">
                {faceImages}
              </div>
              {
                this.state.isLoading ? <LoadingIndicator isDark={true}/> : null
              }
              <small className="mb-1 text-muted">
                Click image and then select who is in the image. This is used for training.
              </small>
              <div className="d-flex flex-wrap mt-2 mb-2">
                <p>Name buttons appear here</p>
              </div>

              <Row>
                <Col md="auto">
                  <Button variant="secondary" size="sm">Train model</Button>
                </Col>
                <Col md="auto">
                  <Button variant="secondary" size="sm">Load more</Button>
                </Col>
                <Col md="auto">
                  <Button variant="danger" size="sm">Delete all visible</Button>
                </Col>
              </Row>

            </Card.Body>
          </Card>
        </div>
      </div>
    )
  }


  faceGroupingFaceImageClickHandler = (file: string) => {
    console.log('Clicked: ', file);
  }


}

export default PersonTraining;
