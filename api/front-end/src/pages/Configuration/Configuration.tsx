import React, {Component} from "react";
import {WithTranslation, withTranslation} from "react-i18next";
import axios, {GET_PYTHON_CONFIGURATION} from "../../axios";
import {AxiosError} from "axios";
import {Card, Table, Form} from "react-bootstrap";
import ErrorIndicator from "../../components/ErrorIndicator/ErrorIndicator";

interface PythonConfigurationInterface {
  status: string,
  data: string,
}

class Configuration extends Component<WithTranslation> {
  private _isMounted: boolean;

  state = {
    isLoading: false,
    pythonConfiguration: {} as PythonConfigurationInterface,
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
        this.setState({pythonConfiguration: data.data as PythonConfigurationInterface, isLoading: false});
      }
    }).catch((error: AxiosError) => {
      this.setState({axiosError: error});
    });
  };

  render() {
    const {t} = this.props;
    return (
      <div className="mt-2 mr-2 ml-2">
        <Card bg="dark" text="light">
          <Card.Header>
            {t('configuration.pythonConfiguration')}
          </Card.Header>
          <Card.Body style={{padding: '0px'}}>
            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Control as="textarea" rows={20} value={this.state.pythonConfiguration.data} />
            </Form.Group>
          </Card.Body>
        </Card>
      </div>
    )
  }
}

// @ts-ignore
export default withTranslation('i18n')(Configuration);
