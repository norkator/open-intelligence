import React, {Component} from "react";
import {ReduxPropsInterface} from "../../../store/dateReducer";
import {Button, Card, Col, Row, Table} from "react-bootstrap";
import {
  getLicensePlates,
  LicensePlatesInterface
} from "../../../utils/HttpUtils";


class Owners extends Component<ReduxPropsInterface> {
  state = {
    totalPlates: 0,
    licensePlates: [] as LicensePlatesInterface[],
    filteredLicensePlates: [] as LicensePlatesInterface[],
  };

  componentDidMount(): void {
    this.loadInstanceDetails().then(() => null);
  }

  async loadInstanceDetails() {
    const licensePlates = await getLicensePlates() as LicensePlatesInterface[];
    this.setState({
      totalPlates: licensePlates.length,
      licensePlates: licensePlates,
      filteredLicensePlates: licensePlates
    });
  }

  render() {
    let owners: JSX.Element[] = [];

    if (this.state.filteredLicensePlates !== undefined) {
      if (this.state.filteredLicensePlates.length > 0) {
        owners = this.state.filteredLicensePlates.map(licensePlate => {
          return (
            <tr key={licensePlate.id}>
              <td>{licensePlate.id}</td>
              <td>{licensePlate.licence_plate}</td>
              <td>{licensePlate.owner_name}</td>
              <td>
                <Row>
                  <Col>
                    <Button variant="dark" size="sm" className="mr-2">
                      Edit
                    </Button>
                    <Button variant="outline-danger" size="sm">
                      Delete
                    </Button>
                  </Col>
                </Row>
              </td>
            </tr>
          )
        });
      }
    }

    return (
      <div className="magictime vanishIn">
        <Card bg="Light" text="dark">
          <Card.Header>
            <b>Vehicle owners</b>
          </Card.Header>
          <Card.Body style={{padding: '0px'}}>
            <input type="text" className="form-control mt-2 mb-2" placeholder="Search filter..."
                   aria-label="Search" onChange={(event: any) => this.onSearchFilterChangeHandler(event)}/>
            <Table striped bordered hover variant="light" size="sm">
              <thead>
              <tr>
                <th>ID</th>
                <th>Plate</th>
                <th>Owner</th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody>
              {owners}
              </tbody>
            </Table>
          </Card.Body>
          <Card.Footer>
            <small className="text-muted">Vehicle count: {this.state.totalPlates}</small>
          </Card.Footer>
        </Card>
      </div>
    )
  }

  onSearchFilterChangeHandler = (event: any) => {
    const value = event.target.value;
    const array = this.state.licensePlates.slice(); // Make new copy
    this.setState({
      filteredLicensePlates: array.filter(f => {
        return String(f.licence_plate).toLowerCase().includes(value) || String(f.owner_name).toLowerCase().includes(value);
      })
    });
  };

}

export default Owners;
