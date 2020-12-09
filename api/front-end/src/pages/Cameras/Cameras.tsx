import React, {Component} from "react";
import axios, {GET_LATEST_CAMERA_IMAGES_PATH} from '../../axios';
import {LoadingIndicator} from "../../components/LoadingIndicator/LoadingIndicator";
import Notifications from "./Notifications/Notifications";
import NetworkErrorIndicator from "../../components/NetworkErrorComponent/NetworkErrorIndicator/NetworkErrorIndicator";
import {AxiosError} from "axios";
import {WithTranslation, withTranslation} from "react-i18next";
import styles from './Cameras.module.css';

interface ImageDataInterface {
  id: string,
  name: string,
  image: string, // this contains image data, long base64 string
  file_name: string,
  file_create_date: string
}

class Cameras extends Component<WithTranslation> {
  private _isMounted: boolean;

  state = {
    windowWidth: window.innerWidth,
    imageData: [] as ImageDataInterface[],
    intervalId: 0,
    isLoading: true,
    axiosError: null as AxiosError | null,
  };

  constructor(props: any) {
    super(props);
    this._isMounted = false;
  }

  componentDidMount(): void {
    this._isMounted = true;
    window.addEventListener("resize", this.handleResize);
    this.loadCameraImages();
    const intervalId = setInterval(() => this.loadCameraImages(), 60 * 1000);
    this.setState({intervalId: intervalId});
  }

  loadCameraImages = () => {
    axios.post(GET_LATEST_CAMERA_IMAGES_PATH).then((data: any) => {
      if (this._isMounted) {
        this.setState({imageData: data.data.images, isLoading: false});
      }
    }).catch((error: AxiosError) => {
      this.setState({axiosError: error});
    });
  };

  componentWillUnmount(): void {
    clearInterval(this.state.intervalId);
    this._isMounted = false;
    window.removeEventListener("resize", this.handleResize);
  }

  handleResize = () => {
    this.setState({windowWidth: window.innerWidth});
  };

  render() {
    const {t} = this.props;
    const cameraFlexStyle = ["d-flex", "justify-content-center", "flex-wrap"];
    let cameraImages: JSX.Element[] = [<div key="null"/>]; // JSX.Element[] = [<span className={cameraFlexStyle.join(' ')}>No camera images available</span>];

    const w = this.state.windowWidth;
    const width = this.state.windowWidth < 400 ? w : w / 2;
    const height = width * 50 / 100;

    if (this.state.imageData !== undefined) {
      if (this.state.imageData.length > 0) {
        cameraImages = this.state.imageData.map(image => {
          return (
            <div key={image.id} style={{width: width, height: height}}>
              <p className={styles.imageDate}>{new Date(image.file_create_date).toLocaleString()}</p>
              <img
                id={image.id}
                title={image.name + ' ' + new Date(image.file_create_date).toDateString()}
                className={['CursorPointer', 'magictime', 'vanishIn', styles.cameraImage].join(' ')}
                src={image.image}
                alt={image.file_name}
              />
            </div>
          )
        });
      }
    }

    return (
      <div className={styles.cameras}>
        {this.state.axiosError !== null ?
          <NetworkErrorIndicator t={t} axiosError={this.state.axiosError}/> : null}
        <Notifications/>
        <div className={cameraFlexStyle.join(' ')}>
          {cameraImages}
        </div>
        { /* Handle showing loading indicator */
          this.state.isLoading ? <LoadingIndicator/> : null
        }
      </div>
    )
  }
}


export default withTranslation('i18n')(Cameras);
