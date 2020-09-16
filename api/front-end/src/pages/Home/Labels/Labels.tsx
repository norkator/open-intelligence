import React, {Component} from "react";
import {Badge, Card} from "react-bootstrap";
import {Doughnut} from 'react-chartjs-2';
import {LoadingIndicator} from "../../../components/LoadingIndicator/LoadingIndicator";
import {
  getIntelligence,
  IntelligenceInterface,
  loadLabelImages,
  LabelInterface
} from '../../../utils/Utils';

export interface DonutDatasetsInterface {
  data: Array<number>,
  backgroundColor: Array<string>,
  hoverBackgroundColor: Array<string>
}

export interface LabelDonutDataInterface {
  labels: Array<string>,
  datasets: Array<DonutDatasetsInterface>
}

class Labels extends Component {
  state = {
    selectedDate: '2020-09-16', // Todo, remember implement passing selected date here, redux?
    isLoading: true,
    labelSelection: null,
    instanceCount: 0,
    storageUse: 'N/A GB',
    labelDonutData: {} as LabelDonutDataInterface,
    labelImages: {} as LabelInterface,
  };

  componentDidMount(): void {
    this.loadIntelligence(this.state.selectedDate).then(() => null);
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
      isLoading: false,
      instanceCount: result.performance.instanceCount,
      storageUse: result.performance.storageUse,
      labelDonutData: labelDonutData,
    });
  };

  onDonutElementClickHandler = (index: number) => {
    const labelSelected = this.state.labelDonutData.labels[index];
    this.setState({isLoading: true, labelSelection: labelSelected});
    this.loadLabelImagesHandler(this.state.selectedDate, labelSelected).then(() => null);
  };

  async loadLabelImagesHandler(date: string, label: string) {
    const result = await loadLabelImages(date, label) as LabelInterface;
    this.setState({isLoading: false, labelImages: result});
  }

  render() {
    let labels: JSX.Element[] = [];

    return (
      <div className="mt-2 mr-2 ml-2">
        <Card bg="dark" text="light">
          <Card.Header>
            <div className="row">
              <div className="col-sm">
                <b>Label viewer</b>
              </div>
              <div className="col-sm text-right">
                <Badge variant="light" className="mr-2">IC{this.state.instanceCount}</Badge>
                <Badge variant="light">STR {this.state.storageUse}</Badge>
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            {
              this.state.labelDonutData.datasets !== undefined ?
                <Doughnut
                  onElementsClick={(element: any) => this.onDonutElementClickHandler(element[0]._index)}
                  data={this.state.labelDonutData}
                  height={300}
                  options={{maintainAspectRatio: false}}/>
                : this.state.isLoading ? <LoadingIndicator/> : null
            }

            <div className="d-flex justify-content-center flex-wrap">
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
          this.state.isLoading ? <LoadingIndicator/> : null
        }

      </div>
    )
  }
}


export default Labels;
