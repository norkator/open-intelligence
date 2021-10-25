import React, {Component} from "react";
import {Badge, Button, Card} from "react-bootstrap";
import {Doughnut} from 'react-chartjs-2';
import {LoadingIndicator} from "../../../components/LoadingIndicator/LoadingIndicator";
import {
  getIntelligence,
  IntelligenceInterface,
  loadLabelImages,
  LabelInterface,
  getObjectDetectionImageFileNameForCroppedImageName,
  ObjectDetectionImageFileNameInterface,
  getObjectDetectionImage,
  ObjectDetectionImageInterface,
  getSuperResolutionImage, SuperResolutionInterface,
} from '../../../utils/HttpUtils';
import {connect} from 'react-redux';
import {ReduxPropsInterface} from "../../../store/reducers/dateReducer";
import {GenericImageModal, ModalPropsInterface} from "../../../components/GenericImageModal/GenericImageModal";
import {
  ActivityChartDataInterface,
  ActivityModal,
  ActivityModalInterface
} from "../../../components/ActivityModal/ActivityModal";
import {withTranslation, WithTranslation} from "react-i18next";
import GetDonutColor from "../../../utils/ColorUtils";
import {SET_AXIOS_ERROR} from "../../../store/actionTypes";
import {AxiosError} from "axios";
import {CommonPropsInterface} from "../../../store/reducers/commonReducer";
import toast, {Toaster} from "react-hot-toast";


export interface DonutDatasetsInterface {
  data: Array<number>,
  backgroundColor: Array<string>,
  hoverBackgroundColor: Array<string>
}

export interface LabelDonutDataInterface {
  labels: Array<string>,
  datasets: Array<DonutDatasetsInterface>
}

let clickHoldTimer: any = null;
let longClickHandled: boolean = false;

class Labels extends Component<ReduxPropsInterface & WithTranslation & CommonPropsInterface | any> {
  state = {
    selectedDate: null,
    isLoading: true,
    labelSelection: null,
    instanceCount: 0,
    storageUse: 'N/A GB',
    labelDonutData: {} as LabelDonutDataInterface,
    labelImages: [] as LabelInterface[],
    genericImageModalData: {show: false} as ModalPropsInterface,
    activityModal: {show: false} as ActivityModalInterface,
    activityChartData: [] as ActivityChartDataInterface[],
  };

  componentDidUpdate(prevProps: Readonly<ReduxPropsInterface>, prevState: Readonly<{}>, snapshot?: any): void {
    if (this.state.selectedDate !== this.props.selectedDate) {
      this.loadIntelligence(this.props.selectedDate).then(() => null);
    }
  }

  componentDidMount(): void {
    this.loadIntelligence(this.props.selectedDate).then(() => null);
  }

  async loadIntelligence(date: string) {
    try {
      const result = await getIntelligence(date) as IntelligenceInterface;
      let labelDonutData = {} as LabelDonutDataInterface;

      labelDonutData.labels = [];
      labelDonutData.datasets = [];

      let dataSet: DonutDatasetsInterface = {
        data: [],
        backgroundColor: [],
        hoverBackgroundColor: []
      };
      let index = 0;
      result.donut.forEach(donut => {
        labelDonutData.labels.push(donut.label);
        dataSet.data.push(donut.value);
        dataSet.backgroundColor.push(GetDonutColor(index));
        dataSet.hoverBackgroundColor.push("#1698af");
        index++;
      });

      labelDonutData.datasets.push(dataSet);

      this.setState({
        selectedDate: date,
        isLoading: false,
        instanceCount: result.performance.instanceCount,
        storageUse: result.performance.storageUse,
        labelDonutData: labelDonutData,
        activityChartData: result.activity.data,
      });
    } catch (e) {
      this.props.onSetAxiosError(e);
    }
  };

  onDonutElementClickHandler = (element: any) => {
    if (element !== undefined && element.length > 0) {
      const index = element[0]._index;
      const labelSelected = this.state.labelDonutData.labels[index];
      this.setState({isLoading: true, labelSelection: labelSelected});
      this.loadLabelImagesHandler(this.props.selectedDate, labelSelected).then(() => null);
    }
  };

  async loadLabelImagesHandler(date: string, label: string) {
    const result = await loadLabelImages(date, label) as LabelInterface[];
    this.setState({isLoading: false, labelImages: result});
  }

  async labelImageClickHandler(file: string, loadObjectDetectionImage: boolean) {
    this.setState({isLoading: true});
    if (loadObjectDetectionImage) {
      this.loadObjectDetectionImageHandler(file).then(() => null);
    } else {
      this.loadSuperResolutionImage(file).then(() => null);
    }
  }

  async loadObjectDetectionImageHandler(croppedImageName: string) {
    this.setState({isLoading: true});
    const file = await getObjectDetectionImageFileNameForCroppedImageName(croppedImageName) as ObjectDetectionImageFileNameInterface;
    const image = await getObjectDetectionImage(file.file_name) as ObjectDetectionImageInterface;
    this.setState({
      isLoading: false,
      genericImageModalData: {
        show: true,
        title: image.file_name,
        description: 'Full object detection image for selected label where label is originating',
        src: image.data,
      }
    });
  };

  async loadSuperResolutionImage(croppedImageName: string) {
    const {t} = this.props;
    this.setState({isLoading: true});
    try {
      const image = await getSuperResolutionImage(this.state.labelSelection || "", croppedImageName) as SuperResolutionInterface;
      // Todo, generic modal image needs more fields to show color, detection result etc
      this.setState({
        isLoading: false,
        genericImageModalData: {
          show: true,
          title: croppedImageName,
          description: (image.srImage ? this.props.t('home.labels.srImage') : this.props.t('home.labels.standardImage')),
          src: image.data,
          showBadges: true,
          srImage: image.srImage,
          detectionResult: image.detectionResult,
          color: image.color,
        }
      });
    } catch (e) {
      toast(t('generic.loadingError'), {
        style: {
          border: '1px solid red',
        },
      });
      this.setState({
        isLoading: false,
      });
    }
  };

  genericImageModalCloseHandler = () => {
    this.setState({genericImageModalData: {show: false}});
  };

  activityModalCloseHandler = () => {
    this.setState({activityModal: {show: false}});
  };

  handleLabelMouseDown = (file: string) => {
    clickHoldTimer = setTimeout(() => {
      console.log('Mouse long click run');
      this.labelImageClickHandler(file, true).then(() => null);
      longClickHandled = true;
    }, 1000);
  };

  handleLabelMouseUp = (file: string) => {
    clearTimeout(clickHoldTimer);
    if (!longClickHandled) {
      console.log('Mouse short click run');
      this.labelImageClickHandler(file, false).then(() => null);
    }
    longClickHandled = false;
  };


  render() {
    const {t} = this.props;
    let labels: JSX.Element[] = [];

    if (this.state.labelImages !== undefined) {
      if (this.state.labelImages.length > 0) {
        labels = this.state.labelImages.map((image: LabelInterface, index: number) => {
          return (
            <div
              onMouseDown={() => this.handleLabelMouseDown(image.file)}
              onMouseUp={() => this.handleLabelMouseUp(image.file)}
              key={image.file + '_' + index}>
              <img
                id={image.file}
                title={image.title}
                className="CursorPointer mr-1 ml-1 mt-1 magictime vanishIn"
                style={{maxHeight: '120px', maxWidth: '120px', width: 'auto', height: 'auto'}}
                key={image.file}
                src={image.image}
                alt={image.file}
              />
            </div>
          )
        });
      }
    }

    return (
      <div>
        <Card bg="Light" text="dark">
          <Card.Header>
            <div className="row">
              <div className="col-sm">
                <b>{t('home.labels.labelViewer')}</b>
              </div>
              <div className="col-sm text-right">
                <Badge variant="dark" className="mr-2">IC{this.state.instanceCount}</Badge>
                <Badge variant="dark">STR {this.state.storageUse}</Badge>
              </div>
            </div>
          </Card.Header>
          <Card.Body>

            {this.state.labelDonutData.labels !== undefined && this.state.labelDonutData.labels.length > 0 ?
              <div style={{height: '300px'}}>
                {
                  this.state.labelDonutData.datasets !== undefined ?
                    <Doughnut
                      onElementsClick={(element: any) => this.onDonutElementClickHandler(element)}
                      data={this.state.labelDonutData}
                      height={300}
                      options={{maintainAspectRatio: false}}/>
                    : this.state.isLoading ? <LoadingIndicator isDark={true}/> : null
                }
              </div>
              :
              <div className="d-flex justify-content-center flex-wrap mt-4">
                <h4>{this.state.isLoading ? t('home.labels.loading') : t('home.labels.noLabels')}</h4>
              </div>
            }

            { /* Handle showing loading indicator */
              this.state.isLoading ? <LoadingIndicator isDark={true}/> : null
            }

            <div className="d-flex justify-content-center flex-wrap mt-4">
              {labels}
            </div>

          </Card.Body>
          <Card.Footer>
            <small
              className="text-muted">{this.state.labelSelection === null ?
              t('home.labels.noLabelSelected') :
              t('home.labels.selectedLabel', {label: this.state.labelSelection})}</small>
            <Button onClick={() => this.showActivityModalHandler()}
                    className="float-right" variant="outline-dark" size="sm">
              {t('home.labels.activityBtn')}
            </Button>
          </Card.Footer>
        </Card>

        <GenericImageModal
          t={t}
          closeHandler={() => this.genericImageModalCloseHandler}
          show={this.state.genericImageModalData.show}
          description={this.state.genericImageModalData.description}
          src={this.state.genericImageModalData.src}
          title={this.state.genericImageModalData.title}
          showBadges={this.state.genericImageModalData.showBadges}
          srImage={this.state.genericImageModalData.srImage}
          detectionResult={this.state.genericImageModalData.detectionResult}
          color={this.state.genericImageModalData.color}
          additionalInfo={this.state.genericImageModalData.additionalInfo}
        />

        <ActivityModal
          t={t}
          show={this.state.activityModal.show}
          title={this.state.activityModal.title}
          description={this.state.activityModal.description}
          closeHandler={() => this.activityModalCloseHandler}
          chartData={this.state.activityModal.chartData}
        />

        <Toaster/>

      </div>
    )
  }

  showActivityModalHandler = () => {
    this.setState({
      activityModal: {
        show: true,
        title: this.props.t('home.labels.activityForSelectedDate'),
        description: this.props.t('home.labels.showingActivityStartOfDay'),
        chartData: this.state.activityChartData,
      }
    });
  }

}

const mapStateToProps = (state: any): any => {
  return {
    selectedDate: state.dateReducer.selectedDate,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onSetAxiosError: (error: AxiosError) => dispatch({type: SET_AXIOS_ERROR, axiosError: error}),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation('i18n')(Labels));
