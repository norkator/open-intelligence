import React, {Component} from "react";
import {Button, Card} from "react-bootstrap";

class PersonTraining extends Component<any, any> {

  render() {
    return (
      <div>
        <div className="magictime vanishIn">
          <Card bg="Light" text="dark">
            <Card.Header>
              <b>Person training</b>
            </Card.Header>
            <Card.Body style={{padding: '5px'}}>
              Body
            </Card.Body>
          </Card>
        </div>
      </div>
    )
  }

}

export default PersonTraining;
