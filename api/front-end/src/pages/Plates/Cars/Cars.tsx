import React, {Component} from "react";
import {ReduxPropsInterface} from "../../../store/dateReducer";
import {Card} from "react-bootstrap";
import DateRangeSelector from "../../Home/DateRangeSelector/DateRangeSelector";
import {getLicensePlateDetections, LicensePlateDetectionsInterface} from "../../../utils/HttpUtils";
import {getNowISODate} from "../../../utils/DateUtils";


class Cars extends Component<ReduxPropsInterface> {
  // Todo, this is reference for this view: https://github.com/norkator/open-intelligence/blob/master/api/html/plates.html
  state = {
    today: getNowISODate(),
    resultOption: 'owner_detail_needed',
    totalPlates: 0,
    licensePlateDetections: [] as LicensePlateDetectionsInterface[],
  };

  componentDidMount(): void {
    // Default will load only today contents, loading big chunk is slow
    this.loadLicensePlateDetections(this.state.today, this.state.today).then(() => null);
  }

  async loadLicensePlateDetections(startDate: string, endDate: string) {
    const licensePlateDetections = await getLicensePlateDetections(
      this.state.resultOption, startDate, endDate) as LicensePlateDetectionsInterface[];
    console.log(licensePlateDetections);
    this.setState({
      licensePlateDetections: licensePlateDetections
    });
  }

  render() {
    return (
      <div>
        <div className="magictime vanishIn">
          <Card bg="Light" text="dark">
            <Card.Header>
              <b>Unknown cars</b>
            </Card.Header>
            <Card.Body style={{padding: '0px'}}>
              <DateRangeSelector {...this.props} />

              <b>Create materialistic view here showing ALPR text and vehicle image</b>

              <p>{this.state.licensePlateDetections.map(a => {
                return <div key={a.title}>{a.detectionResult}</div>
              })}</p>


            </Card.Body>
            <Card.Footer>
              <small className="text-muted">This view shows you cars which require your attention</small>
            </Card.Footer>
          </Card>
        </div>
      </div>
    )
  }
}

export default Cars;
