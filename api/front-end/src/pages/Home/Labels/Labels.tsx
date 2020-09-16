import React, {Component} from "react";
import {Card, Container, Navbar} from "react-bootstrap";


class Labels extends Component {
  render() {
    return (
      <div>
        <Container className="mt-2">
          <Card bg="dark" text="light">
            <Card.Header>Label viewer</Card.Header>
            <Card.Body>
              <Card.Title>Card title</Card.Title>
              <Card.Text>
                This is a wider card with supporting text below as a natural lead-in to
                additional content. This content is a little bit longer.
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <small className="text-muted">Last updated 3 mins ago</small>
            </Card.Footer>
          </Card>
        </Container>
      </div>
    )
  }
}


export default Labels;
