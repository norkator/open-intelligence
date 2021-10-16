import React, {Component} from "react";
import {WithTranslation, withTranslation} from "react-i18next";
import axios, {GET_PYTHON_CONFIGURATION} from "../../axios";
import {AxiosError} from "axios";
import {Button, Card, Form} from "react-bootstrap";

interface PythonConfigurationInterface {
  status: string,
  data: string,
}

class Configuration extends Component<WithTranslation> {
  private _isMounted: boolean;

  state = {
    isLoading: false,
    pythonConfiguration: '',
  };

  constructor(props: any) {
    super(props);
    this._isMounted = false;
  }

  componentDidMount(): void {
    this.loadPythonConfiguration();
    this._isMounted = true;
  }

  componentWillUnmount(): void {
    this._isMounted = false;
  }

  loadPythonConfiguration = () => {
    axios.get(GET_PYTHON_CONFIGURATION).then((data: any) => {
      if (this._isMounted) {
        const config = data.data as PythonConfigurationInterface;
        const pc = new Buffer(config.data, 'base64');
        const decodedPythonConfig = pc.toString('ascii');
        this.setState({pythonConfiguration: decodedPythonConfig, isLoading: false});
      }
    }).catch((error: AxiosError) => {
      this.setState({axiosError: error});
    });
  };


  handleConfigChange = (event: any) => {
    this.setState({pythonConfiguration: event.target.value});
  };

  saveConfigChanges = () => {
  };

  render() {
    const {t} = this.props;
    return (
      <div className="mt-2 mr-2 ml-2">
        <Card bg="dark" text="light">
          <Card.Header>
            {t('configuration.pythonConfiguration')}
          </Card.Header>
          <Card.Body style={{padding: '10px'}}>
            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Control as="textarea" rows={40} value={this.state.pythonConfiguration}
                            onChange={this.handleConfigChange}/>
            </Form.Group>
            <Button onClick={() => this.saveConfigChanges()}
                    className="float-left" variant="outline-light" size="sm">
              {t('configuration.saveChanges')}
            </Button>
          </Card.Body>
        </Card>
      </div>
    )
  }
}

// @ts-ignore
export default withTranslation('i18n')(Configuration);
