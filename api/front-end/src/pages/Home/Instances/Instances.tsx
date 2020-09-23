import React, {Component} from "react";
import {Card, Table} from "react-bootstrap";
import {getInstanceDetails, InstanceInterface} from "../../../utils/HttpUtils";


class Instances extends Component {
  state = {
    instances: [] as InstanceInterface[]
  };

  componentDidMount(): void {
    this.loadInstanceDetails().then(() => null);
  }

  async loadInstanceDetails() {
    const instances = await getInstanceDetails() as InstanceInterface;
    this.setState({instances: instances})
  }

  render() {
    let instances: JSX.Element[] = [];

    if (this.state.instances !== undefined) {
      if (this.state.instances.length > 0) {
        instances = this.state.instances.map(instance => {
          return (
            <tr key={instance.id}>
              <td>{instance.id}</td>
              <td>{instance.process_name}</td>
              <td>{instance.updatedAt}</td>
              <td>{instance.createdAt}</td>
            </tr>
          )
        });
      }
    }

    return (
      <div>
        <Card bg="dark" text="light">
          <Card.Header>
            Running instances
          </Card.Header>
          <Card.Body style={{padding: '0px'}}>
            <div className="table-responsive">
              <Table striped bordered hover variant="dark" style={{minWidth: '650px'}}>
                <thead>
                <tr>
                  <th>ID</th>
                  <th>Process</th>
                  <th>Alive check</th>
                  <th>Started</th>
                </tr>
                </thead>
                <tbody>
                {instances}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>

      </div>
    )
  }
}


export default Instances;

