import React, {Component} from "react";
import {ReduxPropsInterface} from "../../../store/dateReducer";
import {Card} from "react-bootstrap";
import DateRangeSelector from "../../Home/DateRangeSelector/DateRangeSelector";
import {getLicensePlateDetections, LicensePlateDetectionsInterface} from "../../../utils/HttpUtils";
import {getNowISODate} from "../../../utils/DateUtils";
import styles from './Cars.module.css'


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
    let cars: JSX.Element[] = [];

    if (this.state.licensePlateDetections !== undefined) {
      if (this.state.licensePlateDetections.length > 0) {
        cars = this.state.licensePlateDetections.map(detection => {
          return (
            <div key={detection.file} className={styles.zoom} style={{cursor: 'pointer'}}>
              <Card style={{maxWidth: '160px'}} className="mr-1 mt-1 ml-1 mb-1">
                <Card.Img variant="top" src={detection.image} style={{maxHeight: '100px'}}/>
                <Card.Body className="p-2">
                  <Card.Title className="m-0">{detection.detectionResult}</Card.Title>
                </Card.Body>
                <Card.Footer className="p-2">
                  <small className="text-muted">{detection.title}</small>
                </Card.Footer>
              </Card>
            </div>
          )
        });
      }
    }

    return (
      <div>
        <div className="magictime vanishIn">
          <Card bg="Light" text="dark">
            <Card.Header>
              <b>Unknown cars</b>
            </Card.Header>
            <Card.Body style={{padding: '0px'}}>
              <DateRangeSelector {...this.props} />
              <div className="d-flex justify-content-center flex-wrap">
                {cars}
              </div>
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
