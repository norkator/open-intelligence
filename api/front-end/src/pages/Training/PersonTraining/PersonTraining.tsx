import React, {Component} from "react";
import {Button, Card, Col, Row} from "react-bootstrap";
import {
  FaceGroupingData,
  FaceGroupingImagesInterface, FaceGroupingNamesInterface,
  getFaceGroupingImages, moveFaceGroupingImage, trainFaceModelAction,
} from "../../../utils/HttpUtils";
import {LoadingIndicator} from "../../../components/LoadingIndicator/LoadingIndicator";


class PersonTraining extends Component<any, any> {
  state = {
    isLoading: true,
    faceGroupingNames: [] as FaceGroupingNamesInterface[],
    faceGroupingImages: [] as FaceGroupingImagesInterface[],
    loadedFile: '',
    showNames: false,
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
    let names: JSX.Element[] = [];

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

    if (this.state.faceGroupingNames.length > 0) {
      names = this.state.faceGroupingNames.map(name => {
        return (
          <div key={String(name)}>
            <Button onClick={async () => await this.moveFaceGroupingImageHandler(String(name))}
                    variant="outline-secondary"
                    size="sm" className="m-1">
              {name}
            </Button>
          </div>
        )
      });
      names.push(
        <div key="delete">
          <Button onClick={async () => await this.moveFaceGroupingImageHandler('delete')}
                  variant="outline-danger" size="sm"
                  className="m-1">delete</Button>
        </div>
      )
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
              <div className="d-flex flex-wrap mt-2 mb-4">
                {this.state.showNames ? names : null}
              </div>

              <Row>
                <Col md="auto">
                  <Button onClick={async () => await this.trainModelHandler()} variant="secondary" size="sm">Train
                    model</Button>
                </Col>
                <Col md="auto">
                  <Button onClick={() => this.loadMoreHandler()} variant="secondary" size="sm">Load more</Button>
                </Col>
                <Col md="auto">
                  <Button onClick={() => this.deleteAllVisibleHandler()} variant="danger" size="sm">Delete all
                    visible</Button>
                </Col>
              </Row>

            </Card.Body>
          </Card>
        </div>
      </div>
    )
  }


  faceGroupingFaceImageClickHandler = (file: string) => {
    this.setState({
      loadedFile: file,
      showNames: true,
    })
  }

  async moveFaceGroupingImageHandler(name: string) {
    const response = await moveFaceGroupingImage(name, this.state.loadedFile);
    console.log(response);
    this.setState({
      showNames: false
    });
  }

  async trainModelHandler() {
    if (confirm("Send train face model training action?")) {
      const response = await trainFaceModelAction();
      console.log(response);
    }
  }

  loadMoreHandler = () => {
    this.loadFaceGroupingImages().then(() => null);
  }

  deleteAllVisibleHandler = () => {
    this.state.faceGroupingImages.forEach((image: FaceGroupingImagesInterface) => {
      moveFaceGroupingImage('delete', image.file).then(() => null);
    });
  }

}

export default PersonTraining;
