import React, {Component} from "react";
import {Card, Container, Navbar} from "react-bootstrap";
import {Doughnut} from 'react-chartjs-2';
import {LoadingIndicator} from "../../../components/LoadingIndicator/LoadingIndicator";
import {
  getIntelligence,
} from '../../../utils/Utils'


class Labels extends Component {
  state = {
    isLoading: false,
  };

  componentDidMount(): void {
    this.loadIntelligence('2020-09-16');
    // const intervalId = setInterval(() => this.loadFaceImages(this.state.selectedDay), 60 * 1000);
    // this.setState({intervalId: intervalId});
  }

  async loadIntelligence(date: string) {
    const result = await getIntelligence(date);
  };

  data = {
    labels: [
      'Red',
      'Green',
      'Yellow'
    ],
    datasets: [{
      data: [300, 50, 100],
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56'
      ],
      hoverBackgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56'
      ]
    }]
  };

  render() {
    let labels: JSX.Element[] = [];

    return (
      <div className="mt-2 mr-2 ml-2">
        <Card bg="dark" text="light">
          <Card.Header>Label viewer</Card.Header>
          <Card.Body>
            <Doughnut data={this.data} height={300} options={{ maintainAspectRatio: false }}/>

            { /* Handle showing loading indicator */
              this.state.isLoading ? <LoadingIndicator/> : null
            }

            <div className="d-flex justify-content-center flex-wrap">
              {labels}
            </div>

          </Card.Body>
          <Card.Footer>
            <small className="text-muted">Last updated 3 mins ago</small>
          </Card.Footer>
        </Card>
      </div>
    )
  }
}


export default Labels;
