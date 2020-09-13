import React, {Component} from "react";
// import styles from './Cameras.module.css'
import axios, {GET_LATEST_CAMERA_IMAGES_PATH} from '../../axios';

interface ImageDataInterface {
  id: string,
  name: string,
  image: string, // this contains image data, long base64 string
  file_name: string,
  file_create_date: string
}

class Cameras extends Component {
  private _isMounted: boolean;

  state = {
    imageData: [] as ImageDataInterface[]
  };

  constructor(props: any) {
    super(props);
    this._isMounted = false;
  }

  componentDidMount(): void {
    this._isMounted = true;
    axios.post(GET_LATEST_CAMERA_IMAGES_PATH).then((data: any) => {
      if (this._isMounted) {
        this.setState({imageData: data.data.images});
      }
    }).catch(error => {
      console.error(error);
    });
  }

  componentWillUnmount(): void {
    this._isMounted = false;
  }

  render() {
    const cameraFlexStyle = ["d-flex", "justify-content-center", "flex-wrap"];
    let cameraImages: JSX.Element[] = [<div key="null"/>]; // JSX.Element[] = [<span className={cameraFlexStyle.join(' ')}>No camera images available</span>];

    if (this.state.imageData !== undefined) {
      if (this.state.imageData.length > 0) {
        cameraImages = this.state.imageData.map(image => {
          return <div key={image.id}>{image.file_name}</div>
        });
      }
    }

    return (
      <div>
        <div className={cameraFlexStyle.join(' ')}>
          {cameraImages}
        </div>
      </div>
    )
  }
}


export default Cameras;
