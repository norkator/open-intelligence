import React, {Component} from "react";
import {LoadingIndicator} from "../../components/LoadingIndicator/LoadingIndicator";
import {WithTranslation, withTranslation} from "react-i18next";
import {AxiosError} from "axios";
import NetworkErrorIndicator from "../../components/NetworkErrorComponent/NetworkErrorIndicator/NetworkErrorIndicator";
import axios, {GET_HISTORY_CAMERA_IMAGES, GET_HISTORY_CAMERA_NAMES} from "../../axios";
import {ChangeDate} from "../../utils/DateUtils";
import {DropdownButton, FormControl, Dropdown, Alert} from "react-bootstrap";
import styles from './History.module.css'
import toast, {Toaster} from "react-hot-toast";


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
    timeOfDate: '12:00:00',
    historyImages: [] as HistoryInterface[],
    isLoading: false,
    axiosError: null as AxiosError | null,
    showAlert: true,
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
    this.setState({selectedCameraName: cameraName, showAlert: false});
  };

  loadImagesBtnClick = () => {
    const {t} = this.props;
    if (this.state.selectedCameraName !== null && this.state.selectedCameraName !== '') {
      this.setState({isLoading: true});
      this.loadHistoryImages(
        this.state.selectedCameraName,
        this.state.startDate,
        this.state.endDate,
        this.state.timeOfDate
      );
    } else {
      toast.error(t('history.cameraNameNotSelected'));
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
              title={image.fileCreateDate}
              className={['CursorPointer', 'mr-1', 'ml-1', 'mt-1', 'magictime', 'spaceInLeft', styles.historyImages].join(' ')}
              style={{maxHeight: '200px', maxWidth: '250px'}}
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
      <div style={styles}>
        {this.state.axiosError !== null ?
          <NetworkErrorIndicator t={t} axiosError={this.state.axiosError}/> : null}

        {
          this.state.showAlert ?
            <div className="d-flex justify-content-center flex-wrap magictime spaceInRight">
              <Alert key={0} variant={'dark'}>
                <b>Remember to select camera name.</b> By default image target time for each day
                is {this.state.timeOfDate}
              </Alert>
            </div>
            : null
        }

        <div className="d-flex justify-content-center flex-wrap mb-2 magictime spaceInLeft">
          <div className="input-group mb-2" style={{maxWidth: '700px'}}>
            <DropdownButton
              variant="outline-secondary"
              title={t('history.camera')}
              id="camera-names-dropdown-1"
            >
              {cameraNames}
            </DropdownButton>
            <FormControl
              aria-describedby="camera-names-dropdown-1"
              value={this.state.selectedCameraName}
              style={{maxWidth: '80px', backgroundColor: '#343a40', color: '#fff'}}
              onChange={() => null}
            />
            <input
              type="time" className="form-control" placeholder="Time target"
              aria-label="Target time of date" value={this.state.timeOfDate}
              onChange={(event: any) => this.onTimeOfDateSelected(event)}
              style={{maxWidth: '120px', backgroundColor: '#343a40', color: '#999999'}}
            />
            <input
              type="date" className="form-control" placeholder="Change start day"
              aria-label="Start day change" value={this.state.startDate}
              onChange={(event: any) => this.onStartDateSelected(event)}
              style={{backgroundColor: '#343a40', color: '#999999'}}
            />
            <input
              type="date" className="form-control" placeholder="Change end day"
              aria-label="End day change" value={this.state.endDate}
              onChange={(event: any) => this.onEndDateSelected(event)}
              style={{backgroundColor: '#343a40', color: '#999999'}}
            />
            <div className="input-group-append">
              <button className="btn btn-outline-info" type="button" onClick={this.loadImagesBtnClick}>
                {t('history.load')}
              </button>
            </div>
          </div>
        </div>

        { /* Handle showing loading indicator */
          this.state.isLoading ? <LoadingIndicator isDark={false}/> : null
        }

        <div className={['d-flex', 'justify-content-center', 'flex-wrap'].join(' ')}>
          {historyImages}
        </div>

        <Toaster/>

      </div>
    );
  }

  onTimeOfDateSelected = (event: any) => {
    this.setState({timeOfDate: event.target.value});
  };

  onStartDateSelected = (event: any) => {
    this.setState({startDate: event.target.value});
  };

  onEndDateSelected = (event: any) => {
    this.setState({endDate: event.target.value});
  };

}

// @ts-ignore
// Todo, solve why this whines about multiple default exports
export default withTranslation('i18n')(History);
