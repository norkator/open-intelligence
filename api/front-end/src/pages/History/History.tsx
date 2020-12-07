import React, {Component} from "react";
import {LoadingIndicator} from "../../components/LoadingIndicator/LoadingIndicator";
import {WithTranslation, withTranslation} from "react-i18next";
import {AxiosError} from "axios";
import NetworkErrorIndicator from "../../components/NetworkErrorComponent/NetworkErrorIndicator/NetworkErrorIndicator";
import axios, {GET_HISTORY_CAMERA_IMAGES, GET_HISTORY_CAMERA_NAMES} from "../../axios";
import {ChangeDate} from "../../utils/DateUtils";
import {DropdownButton, FormControl, InputGroup, Dropdown, SafeAnchor} from "react-bootstrap";


interface HistoryInterface {
  file: string,
  image: string,
  fileCreateDate: string,
}

class History extends Component<WithTranslation> {
  private _isMounted: boolean;

  state = {
    startDate: ChangeDate(new Date().toISOString().substr(0, 10), -30), // by default minus about one month
    endDate: new Date().toISOString().substr(0, 10),
    cameraNames: [] as String[],
    selectedCameraName: '',
    timeOfDate: '12:00:00', // Todo, implement time of date field
    historyImages: [] as HistoryInterface[],
    isLoading: false,
    axiosError: null as AxiosError | null,
  };


  constructor(props: any) {
    super(props);
    this._isMounted = false;
  }

  componentDidMount(): void {
    this._isMounted = true;
    this.getCameraNames();
  }

  componentWillUnmount(): void {
    this._isMounted = false;
  }

  getCameraNames(): void {
    axios.get(GET_HISTORY_CAMERA_NAMES).then((data: any) => {
      this.setState({cameraNames: data.data, isLoading: false});
    }).catch((error: AxiosError) => {
      this.setState({axiosError: error});
    });
  }

  onCameraNameSelect = (cameraName: String) => {
    this.setState({selectedCameraName: cameraName});
  };

  loadImagesBtnClick = () => {
    if (this.state.selectedCameraName !== null && this.state.selectedCameraName !== '') {
      this.setState({isLoading: true});
      this.loadHistoryImages(
        this.state.selectedCameraName,
        this.state.startDate,
        this.state.endDate,
        this.state.timeOfDate
      );
    } else {
      // Todo, some sort of error|warning dialog here
      console.error('Camera name not selected');
    }
  };

  loadHistoryImages = (cameraName: string, startDate: string, endDate: string, timeOfDate: string) => {
    axios.post(GET_HISTORY_CAMERA_IMAGES, {
      cameraName: cameraName,
      startDate: startDate,
      endDate: endDate,
      timeOfDate: timeOfDate,
    }).then((data: any) => {
      if (this._isMounted) {
        this.setState({historyImages: data.data.images as HistoryInterface[], isLoading: false})
      }
    }).catch((error: AxiosError) => {
      this.setState({axiosError: error});
    });
  };

  render() {
    const {t} = this.props;
    let historyImages: JSX.Element[] = [];
    if (this.state.historyImages !== undefined) {
      if (this.state.historyImages.length > 0) {
        historyImages = this.state.historyImages.map(image => {
          return (
            <img
              id={image.file}
              title={image.title}
              className="CursorPointer mr-1 ml-1 mt-1 magictime spaceInLeft"
              style={{maxHeight: '120px', maxWidth: '120px'}}
              key={image.file}
              src={image.image}
              alt={image.file}
            />
          )
        });
      }
    }

    let cameraNames: any[] = [];
    if (this.state.cameraNames !== undefined) {
      if (this.state.cameraNames.length > 0) {
        cameraNames = this.state.cameraNames.map((cameraName, index) => {
          console.log(cameraName, index);
          return <Dropdown.Item
            onSelect={() => this.onCameraNameSelect(cameraName)}
            key={index}>
            {cameraName}
          </Dropdown.Item>
        });
      }
    }

    return (
      <div>
        {this.state.axiosError !== null ?
          <NetworkErrorIndicator t={t} axiosError={this.state.axiosError}/> : null}
        <div className="d-flex justify-content-center flex-wrap mb-2 magictime spaceInLeft">
          <div className="input-group mb-2" style={{maxWidth: '600px'}}>
            <DropdownButton
              as={InputGroup.Prepend}
              variant="outline-secondary"
              title={t('history.camera')}
              id="camera-names-dropdown-1"
            >
              {cameraNames}
            </DropdownButton>
            <FormControl
              aria-describedby="camera-names-dropdown-1"
              value={this.state.selectedCameraName}
              style={{backgroundColor: '#343a40', color: '#fff'}}
            />
            <input type="text" style={{backgroundColor: '#343a40', color: '#999999'}}
                   className="form-control" value={this.state.startDate}/>
            <input type="text" style={{backgroundColor: '#343a40', color: '#999999'}}
                   className="form-control" value={this.state.endDate}/>
            <div className="input-group-append">
              <button className="btn btn-outline-info" type="button" onClick={this.loadImagesBtnClick}>
                {t('history.load')}
              </button>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-center flex-wrap">
          {historyImages}
        </div>

        { /* Handle showing loading indicator */
          this.state.isLoading ? <LoadingIndicator isDark={false}/> : null
        }

      </div>
    )
  }
}

// @ts-ignore
// Todo, solve why this whines about multiple default exports
export default withTranslation('i18n')(History);
