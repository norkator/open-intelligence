import React, {Component} from "react";
import {Card, Table} from "react-bootstrap";
import {getInstanceDetails, InstanceInterface} from "../../../utils/HttpUtils";
import {WithTranslation, withTranslation} from "react-i18next";
import ErrorIndicator from "../../../components/ErrorIndicator/ErrorIndicator";


class Instances extends Component<WithTranslation> {
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
    const {t} = this.props;
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
            {t('home.instances.runningInstances')}
          </Card.Header>
          <Card.Body style={{padding: '0px'}}>
            {
             !this.hasMainProcessingInstances() ?
               <ErrorIndicator title={t('home.instances.noProcesses.title')} message={t('home.instances.noProcesses.description')} />
               : null
            }
            <div className="table-responsive">
              <Table striped bordered hover variant="dark" style={{minWidth: '650px'}}>
                <thead>
                <tr>
                  <th>ID</th>
                  <th>{t('home.instances.process')}</th>
                  <th>{t('home.instances.aliveCheck')}</th>
                  <th>{t('home.instances.started')}</th>
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
    );
  }

  hasMainProcessingInstances = (): boolean => {
    return this.state.instances.filter((instance: InstanceInterface) => {
      return instance.process_name === 'App.py'
    }).length > 0;
  }

}


export default (withTranslation('i18n')(Instances));

