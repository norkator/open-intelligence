import React, {Component} from "react";
import {ReduxPropsInterface} from "../../../store/dateReducer";
import {Card} from "react-bootstrap";
import DateRangeSelector from "../../Home/DateRangeSelector/DateRangeSelector";

class Cars extends Component<ReduxPropsInterface> {

  // Todo, this is reference for this view: https://github.com/norkator/open-intelligence/blob/master/api/html/plates.html

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
