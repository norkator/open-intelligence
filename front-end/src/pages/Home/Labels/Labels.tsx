import React, {Component} from "react";
import {Badge, Button, Card} from "react-bootstrap";
import 'chart.js/auto';
import {Doughnut, getElementsAtEvent} from 'react-chartjs-2';
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
  getSuperResolutionImage,
  SuperResolutionInterface,
  deleteLabelImage,
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

class Labels extends Component<ReduxPropsInterface & WithTranslation & CommonPropsInterface & {}> {
  chartRef: any;

  constructor(props: ReduxPropsInterface & WithTranslation & CommonPropsInterface & {}) {
    super(props);
    this.chartRef = React.createRef();
  }

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
    } catch (e: any) {
      this.props.onSetAxiosError(e);
    }
  };

  onDonutElementClickHandler = (event: any) => {
    // @ts-ignore
    const elements = getElementsAtEvent(this.chartRef.current, event);
    if (elements !== undefined && elements.length > 0) {
      const index = elements[0].index;
      const labelSelected = this.state.labelDonutData.labels[index];
      this.setState({isLoading: true, labelSelection: labelSelected});
      this.loadLabelImagesHandler(this.props.selectedDate, labelSelected).then(() => null);
    }
  };

  async loadLabelImagesHandler(date: string, label: string) {
    const result = await loadLabelImages(date, label) as LabelInterface[];
    this.setState({isLoading: false, labelImages: result});
  }

  async labelImageClickHandler(id: number, file: string, loadObjectDetectionImage: boolean) {
    this.setState({isLoading: true});
    if (loadObjectDetectionImage) {
      this.loadObjectDetectionImageHandler(id, file).then(() => null);
    } else {
      this.loadSuperResolutionImage(id, file).then(() => null);
    }
  }

  async loadObjectDetectionImageHandler(id: number, croppedImageName: string) {
    this.setState({isLoading: true});
    const file = await getObjectDetectionImageFileNameForCroppedImageName(croppedImageName) as ObjectDetectionImageFileNameInterface;
    const image = await getObjectDetectionImage(file.file_name) as ObjectDetectionImageInterface;
    this.setState({
      isLoading: false,
      genericImageModalData: {
        id: id,
        show: true,
        title: image.file_name,
        description: 'Full object detection image for selected label where label is originating',
        src: image.data,
      }
    });
  };

  async loadSuperResolutionImage(id: number, croppedImageName: string) {
    const {t} = this.props;
    this.setState({isLoading: true});
    try {
      const image = await getSuperResolutionImage(this.state.labelSelection || "", croppedImageName) as SuperResolutionInterface;
      this.setState({
        isLoading: false,
        genericImageModalData: {
          id: id,
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
      toast.error(t('generic.loadingError'));
      this.setState({
        isLoading: false,
      });
    }
  };

  genericImageModalCloseHandler = () => {
    this.setState({genericImageModalData: {show: false}});
  };

  genericImageModalDeleteHandler = async () => {
    const {t} = this.props;
    try {
      await deleteLabelImage(Number(this.state.genericImageModalData.id));
      if (this.state.labelSelection !== null) {
        this.loadLabelImagesHandler(this.props.selectedDate, this.state.labelSelection).then(() => null);
      }
      this.setState({genericImageModalData: {show: false}});
      toast.success(t('home.labels.imageDeleteSuccess'));
    } catch (e) {
      toast.error(t('home.labels.imageDeleteFailed'));
    }
  };

  activityModalCloseHandler = () => {
    this.setState({activityModal: {show: false}});
  };

  handleLabelMouseDown = (id: number, file: string) => {
    clickHoldTimer = setTimeout(() => {
      console.log('Mouse long click run');
      this.labelImageClickHandler(id, file, true).then(() => null);
      longClickHandled = true;
    }, 1000);
  };

  handleLabelMouseUp = (id: number, file: string) => {
    clearTimeout(clickHoldTimer);
    if (!longClickHandled) {
      console.log('Mouse short click run');
      this.labelImageClickHandler(id, file, false).then(() => null);
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
              onMouseDown={() => this.handleLabelMouseDown(image.id, image.file)}
              onMouseUp={() => this.handleLabelMouseUp(image.id, image.file)}
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
              <div className="col-sm d-flex justify-content-end">
                <div className="text-right">
                  <Badge bg="dark" className="me-2">IC{this.state.instanceCount}</Badge>
                  <Badge bg="dark">{t('home.labels.storage')} {this.state.storageUse}</Badge>
                </div>
              </div>
            </div>
          </Card.Header>
          <Card.Body>

            {this.state.labelDonutData.labels !== undefined && this.state.labelDonutData.labels.length > 0 ?
              <div style={{height: '300px'}}>
                {
                  this.state.labelDonutData.datasets !== undefined ?
                    <Doughnut
                      ref={this.chartRef}
                      onClick={(evet: any) => this.onDonutElementClickHandler(evet)}
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
            <div className="row">
              <div className="col-sm">
                <small
                  className="text-muted">{this.state.labelSelection === null ?
                  t('home.labels.noLabelSelected') :
                  t('home.labels.selectedLabel', {label: this.state.labelSelection})}
                </small>
              </div>
              <div className="col-sm d-flex justify-content-end">
                <Button
                  onClick={() => this.showActivityModalHandler()}
                  variant="outline-dark" size="sm"
                >
                  {t('home.labels.activityBtn')}
                </Button>
              </div>
            </div>
          </Card.Footer>
        </Card>

        <GenericImageModal
          t={t}
          id={this.state.genericImageModalData.id}
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
          deleteEnabled={true}
          deleteHandler={() => this.genericImageModalDeleteHandler}
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
