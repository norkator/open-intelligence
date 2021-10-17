import React, {Component} from "react";
import {WithTranslation, withTranslation} from "react-i18next";
import axios, {PYTHON_CONFIGURATION} from "../../axios";
import {AxiosError} from "axios";
import {Button, Card, Form} from "react-bootstrap";
import {LoadingIndicator} from "../../components/LoadingIndicator/LoadingIndicator";

interface PythonConfigurationFieldsInterface {
  app: {
    move_to_processed: string,
    process_sleep_seconds: string,
    cv2_imshow_enabled: string,
  },
  yolo: {
    ignored_labels: string,
  },
  camera: {
    camera_names: string,
    camera_folders: string,
  },
  postgresql: {
    host: string,
    database: string,
    user: string,
    password: string,
  },
  openalpr: {
    enabled: string,
    region: string,
    use_plate_char_length: string,
    plate_char_length: string,
  },
  facerecognition: {
    file_name_prefix: string,
    output_root_path: string,
  },
  streamgrab: {
    sleep_seconds: string,
    jpeg_stream_names: string,
    jpeg_streams: string,
  },
  similarity: {
    delete_files: string,
  },
  super_resolution: {
    use_gpu: string,
    max_width: string,
    max_height: string,
  },
}

interface PythonConfigurationInterface {
  status: string,
  fields: PythonConfigurationFieldsInterface,
  configData: string,
}

class Configuration extends Component<WithTranslation> {
  private _isMounted: boolean;

  state = {
    isLoading: true,
    fields: {} as PythonConfigurationFieldsInterface,
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
    axios.get(PYTHON_CONFIGURATION).then((data: any) => {
      if (this._isMounted) {
        const config = data.data as PythonConfigurationInterface;
        const pc = new Buffer(config.configData, 'base64');
        const decodedPythonConfig = pc.toString('ascii');
        this.setState({
          fields: config.fields,
          pythonConfiguration: decodedPythonConfig,
          isLoading: false
        });
      }
    }).catch((error: AxiosError) => {
      this.setState({axiosError: error});
    });
  };

  handleConfigChange = (mainPath: string, key: string, event: any) => {
    let fields: any = this.state.fields;
    fields[mainPath][key] = event.target.value;
    this.setState({fields: fields});
  };

  saveConfigChanges = () => {
    axios.patch(PYTHON_CONFIGURATION, this.state.fields).then((data: any) => {
      if (this._isMounted) {
        console.log(data);
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
          <Card.Body style={{padding: '10px'}}>
            {
              this.state.isLoading ? <LoadingIndicator isDark={false}/> :
                <>
                  <Form>
                    <div style={{marginTop: 0}}>
                      <h4>App.py settings</h4>
                      <Form.Group>
                        <Form.Label>move_to_processed</Form.Label>
                        <Form.Check type="checkbox" label="True / False"
                                    defaultChecked={this.state.fields.app?.move_to_processed === 'True'}
                        />
                        <Form.Text className="text-muted">
                          Determines are input images placed under /processed folder in same path as origin image is
                          taken
                          from.
                        </Form.Text>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>process_sleep_seconds</Form.Label>
                        <Form.Control type="number" placeholder="4"
                                      value={this.state.fields.app?.process_sleep_seconds}
                                      onChange={(event: any) => {this.handleConfigChange('app', 'process_sleep_seconds', event)}}
                        />
                        <Form.Text className="text-muted">
                          How long looping process should sleep before next image processing run.
                        </Form.Text>
                      </Form.Group>
                      <Form.Group controlId="formBasicCheckbox">
                        <Form.Label>cv2_imshow_enabled</Form.Label>
                        <Form.Check type="checkbox" label="True / False"
                                    defaultChecked={this.state.fields.app?.cv2_imshow_enabled === 'True'}
                        />
                        <Form.Text className="text-muted">
                          If enabled, python process shows a window of what it's seeing. Does not work with containers.
                        </Form.Text>
                      </Form.Group>
                    </div>

                    <div style={{marginTop: 40}}>
                      <h4>Yolo settings</h4>
                      <Form.Group>
                        <Form.Label>ignored_labels</Form.Label>
                        <Form.Control type="text" placeholder="pottedplant,tennis racket,umbrella"
                                      value={this.state.fields.yolo?.ignored_labels}
                        />
                        <Form.Text className="text-muted">
                          Yolo detection will ignore following labels. Separate new ones with comma.
                        </Form.Text>
                      </Form.Group>
                    </div>

                    <div style={{marginTop: 40}}>
                      <h4>Camera settings</h4>
                      <Form.Group>
                        <Form.Label>camera_names</Form.Label>
                        <Form.Control type="text" placeholder="TestCamera1,TestCamera2"
                                      value={this.state.fields.camera.camera_names}
                        />
                        <Form.Text className="text-muted">
                          Camera names. Folders specified below. Separate new ones with comma. Should not be changed
                          afterwards.
                        </Form.Text>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>camera_folders</Form.Label>
                        <Form.Control type="text" placeholder="D:/testCamera1Folder/,D:/testCamera2Folder/,"
                                      value={this.state.fields.camera.camera_folders}
                        />
                        <Form.Text className="text-muted">
                          Where to load images from. Separate new ones with comma. Can be changed later if location
                          changes.
                        </Form.Text>
                      </Form.Group>
                    </div>

                    <div style={{marginTop: 40}}>
                      <h4>Database settings for Postgresql</h4>
                      <Form.Group>
                        <Form.Label>host</Form.Label>
                        <Form.Control type="text" placeholder="localhost"
                                      value={this.state.fields.postgresql.host}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>database</Form.Label>
                        <Form.Control type="text" placeholder="intelligence"
                                      value={this.state.fields.postgresql.database}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>user</Form.Label>
                        <Form.Control type="text" placeholder="user"
                                      value={this.state.fields.postgresql.user}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>password</Form.Label>
                        <Form.Control type="password" placeholder="password"
                                      value={this.state.fields.postgresql.password}
                        />
                      </Form.Group>
                    </div>

                    <div style={{marginTop: 40}}>
                      <h4>OpenALPR settings</h4>
                      <Form.Group>
                        <Form.Label>enabled</Form.Label>
                        <Form.Check type="checkbox" label="True / False"
                                    defaultChecked={this.state.fields.openalpr.enabled === 'True'}
                        />
                        <Form.Text className="text-muted">
                          Software for detecting and reading license plates from images.
                        </Form.Text>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>region</Form.Label>
                        <Form.Control type="text" placeholder="eu"
                                      value={this.state.fields.openalpr.region}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>use_plate_char_length</Form.Label>
                        <Form.Check type="checkbox" label="True / False"
                                    defaultChecked={this.state.fields.openalpr.use_plate_char_length === 'True'}
                        />
                        <Form.Text className="text-muted">
                          Custom option to maybe affect accuracy.
                        </Form.Text>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>plate_char_length</Form.Label>
                        <Form.Control type="number" placeholder="6"
                                      value={this.state.fields.openalpr.use_plate_char_length}
                        />
                      </Form.Group>
                    </div>

                    <div style={{marginTop: 40}}>
                      <h4>Face recognition</h4>
                      <Form.Group>
                        <Form.Label>file_name_prefix</Form.Label>
                        <Form.Control type="text" placeholder=""
                                      value={this.state.fields.facerecognition.file_name_prefix}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>output_root_path</Form.Label>
                        <Form.Control type="text" placeholder="cwd"
                                      value={this.state.fields.facerecognition.output_root_path}
                        />
                        <Form.Text className="text-muted">
                          cwd means current working directory.
                        </Form.Text>
                      </Form.Group>
                    </div>

                    <div style={{marginTop: 40}}>
                      <h4>Stream grab</h4>
                      <Form.Group>
                        <Form.Label>sleep_seconds</Form.Label>
                        <Form.Control type="number" placeholder="4"
                                      value={this.state.fields.streamgrab.sleep_seconds}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>jpeg_stream_names</Form.Label>
                        <Form.Control type="text" placeholder="name"
                                      value={this.state.fields.streamgrab.jpeg_stream_names}
                        />
                        <Form.Text className="text-muted">
                          Name for stream. Separate with comma.
                        </Form.Text>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>jpeg_streams</Form.Label>
                        <Form.Control type="text" placeholder="http://127.0.0.1/mjpg/video.mjpg"
                                      value={this.state.fields.streamgrab.jpeg_streams}
                        />
                        <Form.Text className="text-muted">
                          Camera stream address. Stream grab is handy for taking snapshots from camera streams.
                        </Form.Text>
                      </Form.Group>
                    </div>

                    <div style={{marginTop: 40}}>
                      <h4>Similarity process</h4>
                      <Form.Group>
                        <Form.Label>delete_files</Form.Label>
                        <Form.Check type="checkbox" label="True / False"
                                    defaultChecked={this.state.fields.similarity.delete_files === 'True'}
                        />
                        <Form.Text className="text-muted">
                          This process tries to save some spaces by deleting similar images. You can make it permanently
                          delete photos if needed so.
                        </Form.Text>
                      </Form.Group>
                    </div>

                    <div style={{marginTop: 40}}>
                      <h4>Super resolution</h4>
                      <Form.Group>
                        <Form.Label>use_gpu</Form.Label>
                        <Form.Check type="checkbox" label="True / False"
                                    defaultChecked={this.state.fields.super_resolution.use_gpu === 'True'}
                        />
                        <Form.Text className="text-muted">
                          Using GPU requires complicated CUDA setup.
                        </Form.Text>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>max_width</Form.Label>
                        <Form.Control type="number" placeholder="1000"
                                      value={this.state.fields.super_resolution.max_width}
                        />
                        <Form.Text className="text-muted">
                          This improves license plate detection so process it only for smaller images.
                        </Form.Text>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>max_height</Form.Label>
                        <Form.Control type="number" placeholder="1000"
                                      value={this.state.fields.super_resolution.max_height}
                        />
                        <Form.Text className="text-muted">
                          This improves license plate detection so process it only for smaller images.
                        </Form.Text>
                      </Form.Group>
                    </div>
                  </Form>

                  <hr/>
                  <Form.Group style={{marginTop: 10}} controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Current configuration looks like this</Form.Label>
                    <Form.Control as="textarea" rows={10} value={this.state.pythonConfiguration}/>
                  </Form.Group>

                  <Button onClick={() => this.saveConfigChanges()}
                          className="float-left" variant="outline-light" size="sm">
                    {t('configuration.saveChanges')}
                  </Button>
                </>
            }
          </Card.Body>
        </Card>
      </div>
    )
  }
}

// @ts-ignore
export default withTranslation('i18n')(Configuration);
