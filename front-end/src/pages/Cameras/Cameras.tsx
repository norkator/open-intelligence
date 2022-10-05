import React, {Component} from "react";
import axios, {GET_LATEST_CAMERA_IMAGES_PATH, GET_VOICE_INTELLIGENCE} from '../../axios';
import {LoadingIndicator} from "../../components/LoadingIndicator/LoadingIndicator";
import Notifications from "./Notifications/Notifications";
import NetworkErrorIndicator from "../../components/NetworkErrorComponent/NetworkErrorIndicator/NetworkErrorIndicator";
import {AxiosError} from "axios";
import {WithTranslation, withTranslation} from "react-i18next";
import styles from './Cameras.module.css';
import {toast, Toaster} from "react-hot-toast";

interface ImageDataInterface {
  id: string,
  name: string,
  image: string, // this contains image data, long base64 string
  file_name: string,
  file_create_date: string
}

interface VoiceDataInterface {
  message: string,
}

class Cameras extends Component<WithTranslation> {
  private _isMounted: boolean;

  state = {
    windowWidth: window.innerWidth,
    imageData: [] as ImageDataInterface[],
    voiceData: {} as VoiceDataInterface,
    intervalId: 0,
    intervalIdVoice: 0,
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
    this.loadVoiceIntelligence();
    const intervalIdVoice = setInterval(() => this.loadVoiceIntelligence(), 10 * 1000);
    this.setState({intervalIdVoice: intervalIdVoice});
  }

  loadCameraImages = () => {
    axios.get(GET_LATEST_CAMERA_IMAGES_PATH).then((data: any) => {
      if (this._isMounted) {
        this.setState({imageData: data.data.images, isLoading: false});
      }
    }).catch((error: AxiosError) => {
      this.setState({axiosError: error});
    });
  };

  loadVoiceIntelligence = () => {
    axios.get(GET_VOICE_INTELLIGENCE).then((data: any) => {
      if (this._isMounted) {
        this.setState({voiceData: data.data as VoiceDataInterface});
        this.showToast(this.state.voiceData.message);
        // this.speak(this.state.voiceData.message);
      }
    }).catch((error: AxiosError) => {
      this.setState({axiosError: error});
    });
  };

  speak = (text: string) => {
    if (text !== undefined && text !== '') {
      try {
        const msg = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(msg);
      } catch (e) {
      }
    }
  };

  showToast = (text: string) => {
    if (text !== undefined && text !== '') {
      toast(text,
        {
          icon: '🔔',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }
      );
    }
  };

  componentWillUnmount(): void {
    clearInterval(this.state.intervalId);
    clearInterval(this.state.intervalIdVoice);
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

        <Toaster/>

      </div>
    )
  }
}


export default withTranslation('i18n')(Cameras);
