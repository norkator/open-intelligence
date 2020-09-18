import React, {Component} from "react";
import {Badge, Card} from "react-bootstrap";
import {Doughnut} from 'react-chartjs-2';
import {LoadingIndicator} from "../../../components/LoadingIndicator/LoadingIndicator";
import {
  getIntelligence,
  IntelligenceInterface,
  loadLabelImages,
  LabelInterface,
  getObjectDetectionImageFileNameForCroppedImageName,
  ObjectDetectionImageFileNameInterface,
  getObjectDetectionImage, ObjectDetectionImageInterface
} from '../../../utils/HttpUtils';
import {connect} from 'react-redux';
import {ReduxPropsInterface} from "../../../store/reducer";
import {GenericImageModal, ModalPropsInterface} from "../../../components/GenericImageModal/GenericImageModal";


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

class Labels extends Component<ReduxPropsInterface> {
  state = {
    selectedDate: null,
    isLoading: true,
    labelSelection: null,
    instanceCount: 0,
    storageUse: 'N/A GB',
    labelDonutData: {} as LabelDonutDataInterface,
    labelImages: [] as LabelInterface[],
    genericImageModalData: {show: false} as ModalPropsInterface,
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
    const result = await getIntelligence(date) as IntelligenceInterface;
    let labelDonutData = {} as LabelDonutDataInterface;

    labelDonutData.labels = [];
    labelDonutData.datasets = [];

    let dataSet: DonutDatasetsInterface = {
      data: [],
      backgroundColor: [],
      hoverBackgroundColor: []
    };
    result.donut.forEach(donut => {
      labelDonutData.labels.push(donut.label);
      dataSet.data.push(donut.value);
      dataSet.backgroundColor.push("#13697d"); // Todo, add dynamic random coloring from color range maybe?
      dataSet.hoverBackgroundColor.push("#1698af");
    });

    labelDonutData.datasets.push(dataSet);

    this.setState({
      selectedDate: date,
      isLoading: false,
      instanceCount: result.performance.instanceCount,
      storageUse: result.performance.storageUse,
      labelDonutData: labelDonutData,
    });
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
    console.log(loadObjectDetectionImage);
    this.setState({isLoading: true});
    // Todo, handle click and long click here somehow
    this.loadObjectDetectionImageHandler(file).then(() => null);
  }

  async loadObjectDetectionImageHandler(croppedImageName: string) {
    this.setState({isLoading: true});
    const file = await getObjectDetectionImageFileNameForCroppedImageName(croppedImageName) as ObjectDetectionImageFileNameInterface;
    // Todo: implement error handling for null|undefined file with bar functional component + state
    const image = await getObjectDetectionImage(file.file_name) as ObjectDetectionImageInterface;
    // Todo: add error handling here also
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

  genericImageModalCloseHandler = () => {
    this.setState({genericImageModalData: {show: false}});
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
    let labels: JSX.Element[] = [];

    if (this.state.labelImages !== undefined) {
      if (this.state.labelImages.length > 0) {
        labels = this.state.labelImages.map(image => {
          return (
            <div
              onMouseDown={() => this.handleLabelMouseDown(image.file)}
              onMouseUp={() => this.handleLabelMouseUp(image.file)}>
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
                <b>Label viewer</b>
              </div>
              <div className="col-sm text-right">
                <Badge variant="dark" className="mr-2">IC{this.state.instanceCount}</Badge>
                <Badge variant="dark">STR {this.state.storageUse}</Badge>
              </div>
            </div>
          </Card.Header>
          <Card.Body>
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

            <div className="d-flex justify-content-center flex-wrap mt-4">
              {labels}
            </div>

          </Card.Body>
          <Card.Footer>
            <small
              className="text-muted">{this.state.labelSelection === null ?
              'No label selected' :
              'Selected ' + this.state.labelSelection + ' label'}</small>
          </Card.Footer>
        </Card>

        { /* Handle showing loading indicator */
          this.state.isLoading ? <LoadingIndicator isDark={false}/> : null
        }

        <GenericImageModal
          closeHandler={() => this.genericImageModalCloseHandler}
          show={this.state.genericImageModalData.show}
          description={this.state.genericImageModalData.description}
          src={this.state.genericImageModalData.src}
          title={this.state.genericImageModalData.title}
        />

      </div>
    )
  }
}

const mapStateToProps = (state: any): any => {
  return {
    selectedDate: state.selectedDate,
  };
};

export default connect(mapStateToProps)(Labels);
