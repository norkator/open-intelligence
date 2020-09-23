import {Button, Card} from "react-bootstrap";
import React, {Component} from "react";

class PlateTraining extends Component<any, any> {

  render() {
    return (
      <div>
        <div className="magictime vanishIn">
          <Card bg="Light" text="dark">
            <Card.Header>
              <b>Plate training</b>
            </Card.Header>
            <Card.Body style={{padding: '5px'}}>
              <small className="mb-4">Plate training is only available as old jQuery version. Navigate there using
                button below.</small>
              <div className="mt-2">
                <Button
                  variant="dark"
                  onClick={() => window.open("/plate-training.html", "_blank")}
                >
                  Open plate training
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    )
  }

}

export default PlateTraining;
