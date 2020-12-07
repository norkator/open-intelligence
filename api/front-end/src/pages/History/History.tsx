import React, {Component} from "react";
import {LoadingIndicator} from "../../components/LoadingIndicator/LoadingIndicator";
import {WithTranslation, withTranslation} from "react-i18next";
import {AxiosError} from "axios";
import NetworkErrorIndicator from "../../components/NetworkErrorComponent/NetworkErrorIndicator/NetworkErrorIndicator";


interface HistoryInterface {
  title: string,
  file: string,
  image: string,
  fileCreateDate: string,
}

class History extends Component<WithTranslation> {
  private _isMounted: boolean;

  state = {
    startDate: new Date().toISOString().substr(0, 10),
    endDate: new Date().toISOString().substr(0, 10),
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
  }

  componentWillUnmount(): void {
    this._isMounted = false;
  }

  loadImagesBtnClick = () => {
    // this.loadHistoryImages(null, null);
  };

  loadHistoryImages = (startDate: string, endDate: string) => {
    // axios.post(GET_FACES_FOR_DAY_PATH, {selectedDate: date}).then((data: any) => {
    //   if (this._isMounted) {
    //     this.setState({faceImages: this.removeDuplicates(data.data.images as FacesInterface[]), isLoading: false});
    //   }
    // }).catch((error: AxiosError) => {
    //   this.setState({axiosError: error});
    // });
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

    return (
      <div>
        {this.state.axiosError !== null ?
          <NetworkErrorIndicator t={t} axiosError={this.state.axiosError}/> : null}
        <div className="d-flex justify-content-center flex-wrap mb-2 magictime spaceInLeft">
          <div className="input-group mb-2" style={{maxWidth: '300px'}}>
            <input type="text" style={{backgroundColor: '#343a40', color: '#999999'}}
                   disabled className="form-control" value={this.state.startDate}/>
            <input type="text" style={{backgroundColor: '#343a40', color: '#999999'}}
                   disabled className="form-control" value={this.state.endDate}/>
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
