import React from "react";
import {Button, Modal} from "react-bootstrap";


export const PlateEditModal = (props: PlateEditModalPropsInterface) => {
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

        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={props.saveHandler()}>
            Save
          </Button>
          <Button variant="secondary" onClick={props.closeHandler()}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
};

export interface PlateEditModalPropsInterface {
  show: boolean;
  title: string;
  description: string;
  saveHandler: Function;
  closeHandler: Function;
  id: number;
  licencePlate: string;
  ownerName: string;

}
