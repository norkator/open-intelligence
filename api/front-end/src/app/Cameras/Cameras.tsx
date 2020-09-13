import React, {Component} from "react";
import styles from './Cameras.module.css'
import axios, {GET_LATEST_CAMERA_IMAGES_PATH} from '../../axios';

interface ImageDataInterface {
  id: string,
  name: string,
  image: string, // this contains image data, long base64 string
  file_name: string,
  file_create_date: string
}

class Cameras extends Component {
  state = {
    imageData: [] as ImageDataInterface[]
  };

  componentDidMount(): void {
    axios.post(GET_LATEST_CAMERA_IMAGES_PATH).then((data: any) => {
      this.setState({imageData: data.data.images})
    }).catch(error => {
      console.error(error);
    });
  }

  render() {
    const cameraFlexStyle = ["d-flex", "justify-content-center", "flex-wrap", "CameraFlexStyle"];
    let cameraImages: JSX.Element[] = [<span>No camera images available</span>];

    if (this.state.imageData !== undefined) {
      cameraImages = this.state.imageData.map(image => {
        return <div key={image.id}>{image.file_name}</div>
      });
    }

    return (
      <div className={styles.Cameras}>
        <div className={cameraFlexStyle.join(' ')}>
          {cameraImages}
        </div>
      </div>
    )
  }
}


export default Cameras;
