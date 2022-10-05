import React from "react";
import {Button, Modal} from "react-bootstrap";

/**
 * This class idea is to show big object detection raw images from anywhere where it's called
 */
export const GenericImageModal = (props: ModalPropsInterface) => {
  // Note: set modal 'animation={false}' to avoid findDOMNode warning, I use it for now since animations are cool
  return (
    <>
      <Modal size="lg" show={props.show} onHide={props.closeHandler()}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h5>{props.title}</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted mb-2">{props.description}</p>

          {props.showBadges ?
            <div className="d-flex flex-row bd-highlight mb-2">
              <div className="bd-highlight"><span
                className="badge badge-warning">{props.srImage ? props.t('genericImageModal.srVersion') : props.t('genericImageModal.normalVersion')}</span>
              </div>
              <div className="ml-2 bd-highlight"><span className="badge badge-info">{props.detectionResult}</span>
              </div>
              <div className="ml-2 bd-highlight"><span className="badge badge-secondary">{props.color}</span></div>
              <div className="ml-2 bd-highlight"><span className="badge badge-dark">{props.additionalInfo}</span></div>
            </div> : null
          }

          <img className="card-img-right" style={{width: '100%', height: '100%'}}
               alt="genericModalImage" src={props.src}/>
        </Modal.Body>
        <Modal.Footer>
          {
            props.deleteEnabled ?
              <Button variant="danger" onClick={props.deleteHandler()}>
                {props.t('generic.delete')}
              </Button>
              : null
          }
          <Button variant="secondary" onClick={props.closeHandler()}>
            {props.t('generic.close')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
};

export interface ModalPropsInterface {
  id: number;
  t: Function;
  show: boolean;
  title: string;
  description: string;
  src: string; // This is base64 encoded image data
  closeHandler: Function;
  showBadges: boolean;
  srImage: boolean;
  detectionResult: string;
  color: string;
  additionalInfo: string;
  deleteEnabled: boolean;
  deleteHandler: Function;
}
