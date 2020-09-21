import React, {Component} from "react";
import {ReduxPropsInterface} from "../../../store/dateReducer";
import {Button, Card, Col, Row, Table} from "react-bootstrap";
import {
  getLicensePlates,
  LicensePlatesInterface
} from "../../../utils/HttpUtils";
import {PlateEditModal, PlateEditModalPropsInterface} from "../../../components/PlateEditModal/PlateEditModal";


class Owners extends Component<ReduxPropsInterface> {
  state = {
    totalPlates: 0,
    licensePlates: [] as LicensePlatesInterface[],
    filteredLicensePlates: [] as LicensePlatesInterface[],
    plateEditModalData: {show: false} as PlateEditModalPropsInterface,
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
            <div className="row">
              <div className="col-sm">
                <input type="text" className="form-control mt-2 mb-2" placeholder="Search filter..."
                       aria-label="Search" onChange={(event: any) => this.onSearchFilterChangeHandler(event)}/>
              </div>
              <div className="col-sm-auto">
                <div>
                  <Button variant="info" className="mt-2 mr-2">
                    Add plate
                  </Button>
                </div>
              </div>
            </div>
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

        <PlateEditModal
          show={this.state.plateEditModalData.show}
          title={this.state.plateEditModalData.title}
          description={this.state.plateEditModalData.description}
          id={this.state.plateEditModalData.id}
          licencePlate={this.state.plateEditModalData.licencePlate}
          ownerName={this.state.plateEditModalData.ownerName}
          closeHandler={() => this.plateEditModalCloseHandler}
          saveHandler={(plateObject: PlateEditModalPropsInterface) => this.plateEditModalSaveHandler(plateObject)}
        />


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

  plateEditModalCloseHandler = () => {
    this.setState({genericImageModalData: {show: false}});
  };

  plateEditModalSaveHandler = (plateObject: PlateEditModalPropsInterface) => {
  };

}

export default Owners;
