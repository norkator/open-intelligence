import React, {Component} from "react";
import {WithTranslation, withTranslation} from "react-i18next";
import axios, {PYTHON_CONFIGURATION} from "../../axios";
import {AxiosError, AxiosResponse} from "axios";
import {Button, Card, Form} from "react-bootstrap";
import {LoadingIndicator} from "../../components/LoadingIndicator/LoadingIndicator";
import toast, {Toaster} from "react-hot-toast";

interface PythonConfigurationFieldsInterface {
  app: {
    move_to_processed: string,
    process_sleep_seconds: string,
    cv2_imshow_enabled: string,
    output_folder: string,
  },
  yolo: {
    ignored_labels: string,
  },
  camera: {
    cameras_root_path: string,
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
}

class Configuration extends Component<WithTranslation> {
  private _isMounted: boolean;

  state = {
    isLoading: true,
    fields: {} as PythonConfigurationFieldsInterface,
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
    axios.get(PYTHON_CONFIGURATION).then((response: AxiosResponse) => {
      const fields: PythonConfigurationFieldsInterface = response.data.fields;
      if (this._isMounted) {
        this.setState({
          fields: fields,
          isLoading: false
        });
      }
    }).catch((error: AxiosError) => {
      this.setState({axiosError: error});
    });
  };

  handleConfigChange = (mainPath: string, key: string, event: any, isBooleanValue = false) => {
    let fields: any = this.state.fields;
    fields[mainPath][key] = isBooleanValue ?
      (event.target.checked ? 'True' : 'False') :
      event.target.value;
    this.setState({fields: fields});
  };

  saveConfigChanges = () => {
    const {t} = this.props;
    axios.patch(PYTHON_CONFIGURATION, this.state.fields).then((data: any) => {
      if (this._isMounted) {
        if (data.status === 200) {
          this.loadPythonConfiguration();
          toast.success(t('configuration.configurationSaved'));
        } else {
          toast.error('configuration.configurationSaveFailed');
        }
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
                      <h4>App.py {t('configuration.settings')}</h4>
                      <Form.Group>
                        <Form.Label>move_to_processed</Form.Label>
                        <Form.Check
                          type="checkbox" label={t('generic.enabled')}
                          defaultChecked={this.state.fields.app?.move_to_processed === 'True'}
                          onChange={(event: any) => {
                            this.handleConfigChange('app', 'move_to_processed', event, true)
                          }}
                        />
                        <Form.Text className="text-muted">
                          {t('configuration.moveToProcessedHint')}
                        </Form.Text>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>process_sleep_seconds</Form.Label>
                        <Form.Control
                          type="number" placeholder="4"
                          value={this.state.fields.app?.process_sleep_seconds}
                          onChange={(event: any) => {
                            this.handleConfigChange('app', 'process_sleep_seconds', event)
                          }}
                        />
                        <Form.Text className="text-muted">
                          {t('configuration.processSleepSecondsHint')}
                        </Form.Text>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>cv2_imshow_enabled</Form.Label>
                        <Form.Check
                          type="checkbox" label={t('generic.enabled')}
                          defaultChecked={this.state.fields.app?.cv2_imshow_enabled === 'True'}
                          onChange={(event: any) => {
                            this.handleConfigChange('app', 'cv2_imshow_enabled', event, true)
                          }}
                        />
                        <Form.Text className="text-muted">
                          {t('configuration.cv2ImshowEnabledHint')}
                        </Form.Text>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>output_folder</Form.Label>
                        <Form.Control
                          type="text" placeholder="/output_test/"
                          value={this.state.fields.app?.output_folder}
                          onChange={(event: any) => {
                            this.handleConfigChange('app', 'output_folder', event)
                          }}
                        />
                        <Form.Text className="text-muted">
                          Output folder is used to save all Open-Intelligence image related data.
                        </Form.Text>
                      </Form.Group>
                    </div>

                    <div style={{marginTop: 40}}>
                      <h4>Yolo {t('configuration.settings')}</h4>
                      <Form.Group>
                        <Form.Label>ignored_labels</Form.Label>
                        <Form.Control
                          type="text" placeholder="pottedplant,tennis racket,umbrella"
                          value={this.state.fields.yolo?.ignored_labels}
                          onChange={(event: any) => {
                            this.handleConfigChange('yolo', 'ignored_labels', event)
                          }}
                        />
                        <Form.Text className="text-muted">
                          {t('configuration.ignoredLabelsHint')}
                        </Form.Text>
                      </Form.Group>
                    </div>

                    <div style={{marginTop: 40}}>
                      <h4>Camera {t('configuration.settings')}</h4>
                      <Form.Group>
                        <Form.Label>cameras_root_path</Form.Label>
                        <Form.Control
                          type="text" placeholder="/input_test"
                          value={this.state.fields.camera.cameras_root_path}
                          onChange={(event: any) => {
                            this.handleConfigChange('camera', 'cameras_root_path', event)
                          }}
                        />
                        <Form.Text className="text-muted">
                          Specifies main root path which under all folders for each camera source images are stored.
                        </Form.Text>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>camera_names</Form.Label>
                        <Form.Control
                          type="text" placeholder="TestCamera1,TestCamera2"
                          value={this.state.fields.camera.camera_names}
                          onChange={(event: any) => {
                            this.handleConfigChange('camera', 'camera_names', event)
                          }}
                        />
                        <Form.Text className="text-muted">
                          {t('configuration.cameraNamesHint')}
                        </Form.Text>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>camera_folders</Form.Label>
                        <Form.Control
                          type="text" placeholder="D:/testCamera1Folder/,D:/testCamera2Folder/,"
                          value={this.state.fields.camera.camera_folders}
                          onChange={(event: any) => {
                            this.handleConfigChange('camera', 'camera_folders', event)
                          }}
                        />
                        <Form.Text className="text-muted">
                          {t('configuration.cameraFoldersHint')}
                        </Form.Text>
                      </Form.Group>
                    </div>

                    <div style={{marginTop: 40}}>
                      <h4>Database {t('configuration.settings')} {t('configuration.forPostgreSQL')}</h4>
                      <Form.Group>
                        <Form.Label>host</Form.Label>
                        <Form.Control
                          type="text" placeholder="localhost"
                          value={this.state.fields.postgresql.host}
                          onChange={(event: any) => {
                            this.handleConfigChange('postgresql', 'host', event)
                          }}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>database</Form.Label>
                        <Form.Control
                          type="text" placeholder="intelligence"
                          value={this.state.fields.postgresql.database}
                          onChange={(event: any) => {
                            this.handleConfigChange('postgresql', 'database', event)
                          }}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>user</Form.Label>
                        <Form.Control
                          type="text" placeholder="user"
                          value={this.state.fields.postgresql.user}
                          onChange={(event: any) => {
                            this.handleConfigChange('postgresql', 'user', event)
                          }}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>password</Form.Label>
                        <Form.Control
                          type="password" placeholder="password"
                          value={this.state.fields.postgresql.password}
                          onChange={(event: any) => {
                            this.handleConfigChange('postgresql', 'password', event)
                          }}
                        />
                      </Form.Group>
                    </div>

                    <div style={{marginTop: 40}}>
                      <h4>OpenALPR {t('configuration.settings')}</h4>
                      <Form.Group>
                        <Form.Label>enabled</Form.Label>
                        <Form.Check
                          type="checkbox" label={t('generic.enabled')}
                          defaultChecked={this.state.fields.openalpr.enabled === 'True'}
                          onChange={(event: any) => {
                            this.handleConfigChange('openalpr', 'enabled', event, true)
                          }}
                        />
                        <Form.Text className="text-muted">
                          {t('configuration.openAlprEnabledHint')}
                        </Form.Text>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>region</Form.Label>
                        <Form.Control
                          type="text" placeholder="eu"
                          value={this.state.fields.openalpr.region}
                          onChange={(event: any) => {
                            this.handleConfigChange('openalpr', 'region', event)
                          }}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>use_plate_char_length</Form.Label>
                        <Form.Check
                          type="checkbox" label={t('generic.enabled')}
                          defaultChecked={this.state.fields.openalpr.use_plate_char_length === 'True'}
                          onChange={(event: any) => {
                            this.handleConfigChange('openalpr', 'use_plate_char_length', event, true)
                          }}
                        />
                        <Form.Text className="text-muted">
                          {t('configuration.usePlateCharLengthHint')}
                        </Form.Text>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>plate_char_length</Form.Label>
                        <Form.Control
                          type="number" placeholder="6"
                          value={this.state.fields.openalpr.plate_char_length}
                          onChange={(event: any) => {
                            this.handleConfigChange('openalpr', 'plate_char_length', event)
                          }}
                        />
                      </Form.Group>
                    </div>

                    <div style={{marginTop: 40}}>
                      <h4>{t('configuration.faceRecognition')}</h4>
                      <Form.Group>
                        <Form.Label>file_name_prefix</Form.Label>
                        <Form.Control
                          type="text" placeholder=""
                          value={this.state.fields.facerecognition.file_name_prefix}
                          onChange={(event: any) => {
                            this.handleConfigChange('facerecognition', 'file_name_prefix', event)
                          }}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>output_root_path</Form.Label>
                        <Form.Control
                          type="text" placeholder="cwd"
                          value={this.state.fields.facerecognition.output_root_path}
                          onChange={(event: any) => {
                            this.handleConfigChange('facerecognition', 'output_root_path', event)
                          }}
                        />
                        <Form.Text className="text-muted">
                          {t('configuration.outputRootPathHint')}
                        </Form.Text>
                      </Form.Group>
                    </div>

                    <div style={{marginTop: 40}}>
                      <h4>Stream grab</h4>
                      <Form.Group>
                        <Form.Label>sleep_seconds</Form.Label>
                        <Form.Control
                          type="number" placeholder="4"
                          value={this.state.fields.streamgrab.sleep_seconds}
                          onChange={(event: any) => {
                            this.handleConfigChange('streamgrab', 'sleep_seconds', event)
                          }}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>jpeg_stream_names</Form.Label>
                        <Form.Control
                          type="text" placeholder="name"
                          value={this.state.fields.streamgrab.jpeg_stream_names}
                          onChange={(event: any) => {
                            this.handleConfigChange('streamgrab', 'jpeg_stream_names', event)
                          }}
                        />
                        <Form.Text className="text-muted">
                          {t('configuration.jpegStreamNamesHint')}
                        </Form.Text>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>jpeg_streams</Form.Label>
                        <Form.Control
                          type="text" placeholder="http://127.0.0.1/mjpg/video.mjpg"
                          value={this.state.fields.streamgrab.jpeg_streams}
                          onChange={(event: any) => {
                            this.handleConfigChange('streamgrab', 'jpeg_streams', event)
                          }}
                        />
                        <Form.Text className="text-muted">
                          {t('configuration.jpegStreamsHint')}
                        </Form.Text>
                      </Form.Group>
                    </div>

                    <div style={{marginTop: 40}}>
                      <h4>{t('configuration.similarityProcess')}</h4>
                      <Form.Group>
                        <Form.Label>delete_files</Form.Label>
                        <Form.Check
                          type="checkbox" label={t('generic.enabled')}
                          defaultChecked={this.state.fields.similarity.delete_files === 'True'}
                          onChange={(event: any) => {
                            this.handleConfigChange('similarity', 'delete_files', event, true)
                          }}
                        />
                        <Form.Text className="text-muted">
                          {t('configuration.deleteFilesHint')}
                        </Form.Text>
                      </Form.Group>
                    </div>

                    <div style={{marginTop: 40}}>
                      <h4>{t('configuration.superResolution')}</h4>
                      <Form.Group>
                        <Form.Label>use_gpu</Form.Label>
                        <Form.Check
                          type="checkbox" label={t('generic.enabled')}
                          defaultChecked={this.state.fields.super_resolution.use_gpu === 'True'}
                          onChange={(event: any) => {
                            this.handleConfigChange('super_resolution', 'use_gpu', event, true)
                          }}
                        />
                        <Form.Text className="text-muted">
                          {t('configuration.useGpuHint')}
                        </Form.Text>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>max_width</Form.Label>
                        <Form.Control
                          type="number" placeholder="1000"
                          value={this.state.fields.super_resolution.max_width}
                          onChange={(event: any) => {
                            this.handleConfigChange('super_resolution', 'max_width', event)
                          }}
                        />
                        <Form.Text className="text-muted">
                          {t('configuration.maxWidthHint')}
                        </Form.Text>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>max_height</Form.Label>
                        <Form.Control
                          type="number" placeholder="1000"
                          value={this.state.fields.super_resolution.max_height}
                          onChange={(event: any) => {
                            this.handleConfigChange('super_resolution', 'max_height', event)
                          }}
                        />
                        <Form.Text className="text-muted">
                          {t('configuration.maxWidthHint')}
                        </Form.Text>
                      </Form.Group>
                    </div>
                  </Form>

                  <Button onClick={() => this.saveConfigChanges()}
                          className="float-left mt-5" variant="outline-light" size="sm">
                    {t('configuration.saveChanges')}
                  </Button>

                  <Toaster/>

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
