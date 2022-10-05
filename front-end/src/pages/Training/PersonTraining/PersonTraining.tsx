import React, {Component} from "react";
import {Button, Card, Col, Row} from "react-bootstrap";
import {
  FaceGroupingData,
  FaceGroupingImagesInterface,
  FaceGroupingNamesInterface,
  getFaceGroupingImages,
  moveFaceGroupingImage,
  trainFaceModelAction,
} from "../../../utils/HttpUtils";
import {LoadingIndicator} from "../../../components/LoadingIndicator/LoadingIndicator";
import {
  withTranslation,
  WithTranslation
} from "react-i18next";
import {CommonPropsInterface} from "../../../store/reducers/commonReducer";
import {SET_AXIOS_ERROR} from "../../../store/actionTypes";
import {AxiosError} from "axios";
import {connect} from "react-redux";


class PersonTraining extends Component<WithTranslation & CommonPropsInterface> {
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
    try {
      const faceGroupingData = await getFaceGroupingImages() as FaceGroupingData;
      this.setState({
        isLoading: false,
        faceGroupingNames: faceGroupingData.names,
        faceGroupingImages: faceGroupingData.images,
      });
    } catch (e) {
      this.props.onSetAxiosError(e);
    }
  }


  render() {
    const {t} = this.props;
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

    if (this.state.faceGroupingNames !== undefined && this.state.faceGroupingNames.length > 0) {
      names = this.state.faceGroupingNames.map(name => {
        return (
          <div key={String(name)}>
            <Button onClick={async () => await this.moveFaceGroupingImageHandler(String(name))}
                    variant="outline-secondary"
                    size="sm" className="m-1">
              {String(name)}
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
              <b>{t('training.personTraining.title')}</b>
            </Card.Header>
            <Card.Body className="d-flex flex-column align-items-center" style={{padding: '5px'}}>
              <div className="d-flex flex-wrap mt-2 mb-2">
                {faceImages}
              </div>
              {
                this.state.isLoading ? <LoadingIndicator isDark={true}/> : null
              }
              <small className="mb-1 text-muted">
                {t('training.personTraining.clickImageDescription')}
              </small>
              <div className="d-flex flex-wrap mt-2 mb-4">
                {this.state.showNames ? names : null}
              </div>

              <Row>
                <Col md="auto">
                  <Button onClick={async () => await this.trainModelHandler()} variant="secondary" size="sm">
                    {t('training.personTraining.trainModel')}
                  </Button>
                </Col>
                <Col md="auto">
                  <Button onClick={() => this.loadMoreHandler()} variant="secondary" size="sm">
                    {t('training.personTraining.loadMore')}
                  </Button>
                </Col>
                <Col md="auto">
                  <Button onClick={() => this.deleteAllVisibleHandler()} variant="danger" size="sm">
                    {t('training.personTraining.deleteAllVisible')}
                  </Button>
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
  };

  async moveFaceGroupingImageHandler(name: string) {
    await moveFaceGroupingImage(name, this.state.loadedFile);
    this.setState({
      showNames: false,
      faceGroupingImages: this.state.faceGroupingImages.filter((image: FaceGroupingImagesInterface) => {
        return image.file !== this.state.loadedFile;
      })
    });
  }

  async trainModelHandler() {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Send train face model training action?")) {
      const response = await trainFaceModelAction();
      // eslint-disable-next-line no-restricted-globals
      alert(response);
    }
  }

  loadMoreHandler = () => {
    this.setState({
      isLoading: true
    });
    this.loadFaceGroupingImages().then(() => null);
  };

  deleteAllVisibleHandler = () => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Really delete all visible images?")) {
      this.state.faceGroupingImages.forEach((image: FaceGroupingImagesInterface) => {
        moveFaceGroupingImage('delete', image.file).then(() => null);
      });
      this.setState({
        faceGroupingImages: [] as FaceGroupingImagesInterface[]
      });
      this.loadFaceGroupingImages().then(() => null);
    }
  }

}

const mapDispatchToProps = (dispatch: any) => {
  return {
    onSetAxiosError: (error: AxiosError) => dispatch({type: SET_AXIOS_ERROR, axiosError: error}),
  }
};


export default connect(null, mapDispatchToProps)(withTranslation('i18n')(PersonTraining));
