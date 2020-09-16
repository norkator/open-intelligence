import React, {Component} from "react";
import {Badge, Card} from "react-bootstrap";
import {Doughnut} from 'react-chartjs-2';
import {LoadingIndicator} from "../../../components/LoadingIndicator/LoadingIndicator";
import {
  getIntelligence,
  IntelligenceInterface,
} from '../../../utils/Utils';

export interface LabelDonutDataInterface {
  labels: [],
  datasets: [{
    data: [],
    backgroundColor: [],
    hoverBackgroundColor: []
  }]
}

class Labels extends Component {
  state = {
    isLoading: true,
    labelSelection: 'No label selected',
    instanceCount: 0,
    storageUse: 'N/A GB',
    labelDonutData: {} as LabelDonutDataInterface,
  };

  componentDidMount(): void {
    this.loadIntelligence('2020-09-16').then(() => null);
  }

  async loadIntelligence(date: string) {
    const result = await getIntelligence(date) as IntelligenceInterface;
    console.log(result);
    this.setState({
      isLoading: false,
      instanceCount: result.performance.instanceCount,
      storageUse: result.performance.storageUse,
    });
  };

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
                <Doughnut data={this.state.labelDonutData} height={300} options={{maintainAspectRatio: true}}/>
                : this.state.isLoading ? <LoadingIndicator/> : null
            }

            <div className="d-flex justify-content-center flex-wrap">
              {labels}
            </div>

          </Card.Body>
          <Card.Footer>
            <small className="text-muted">{this.state.labelSelection}</small>
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
