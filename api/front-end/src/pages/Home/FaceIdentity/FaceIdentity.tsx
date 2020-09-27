import React, {Component} from "react";
import {Card} from "react-bootstrap";
import {
  FacesInterface,
  getFaces, tryFaceDetectionAgain,
} from "../../../utils/HttpUtils";
import {ReduxPropsInterface} from "../../../store/reducers/dateReducer";
import {connect} from "react-redux";
import styles from './FaceIdentity.module.css'
import {WithTranslation, withTranslation} from "react-i18next";


class FaceIdentity extends Component<ReduxPropsInterface & WithTranslation> {
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
    const {t} = this.props;
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
            {t('home.faceIdentity.faceIdentifications')}
          </Card.Header>
          <Card.Body style={{padding: '0px'}}>
            <div className="d-flex justify-content-center flex-wrap">
              {faces}
            </div>
          </Card.Body>
          <Card.Footer className="p-2">
            <small className="text-muted">
              {t('home.faceIdentity.faceIdentificationsFooter')}
            </small>
          </Card.Footer>
        </Card>
      </div>
    )
  }


  async onFaceClickHandler(id: string) {
    // eslint-disable-next-line no-restricted-globals
    if (confirm(this.props.t('home.faceIdentity.tryFaceDetectionAgain'))) {
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

export default connect(mapStateToProps)(withTranslation('i18n')(FaceIdentity));


