import React from "react";
import {Button, Modal} from "react-bootstrap";

/**
 * This class idea is to show big object detection raw images from anywhere where it's called
 */
export const GenericImageModal = (props: ModalPropsInterface) => {
  return (
    <>
      <Modal show={props.show} onHide={props.closeHandler()}>
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted">{props.description}</p>
          <img className="card-img-right" style={{width: '100%', height: '100%'}}
               alt="genericModalImage" src={props.src}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.closeHandler()}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
};

export interface ModalPropsInterface {
  show: boolean;
  title: string;
  description: string;
  src: string; // This is base64 encoded image data
  closeHandler: Function;
}
