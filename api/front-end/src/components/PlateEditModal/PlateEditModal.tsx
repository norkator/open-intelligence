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

            {
                props.imageData !== undefined ? <img src={props.imageData} alt={props.title} /> : null
            }

          <form className="mt-4">
            <div className="form-group">
              <label htmlFor="new_plate_licence_plate">Licence plate</label>
              <input type="text" className="form-control" defaultValue={props.licencePlate}
                     onChange={(event) => props.lpOnChange(event.target.value)}
              />
              <small className="form-text text-muted">Input without lines, example ABC123</small>
            </div>
            <div className="form-group">
              <label htmlFor="new_plate_owner_name">Owner name</label>
              <input type="text" className="form-control" defaultValue={props.ownerName}
                     onChange={(event) => props.ownerOnChange(event.target.value)}
              />
              <small className="form-text text-muted">Give full owner name</small>
            </div>
          </form>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => props.saveHandler(props)}>
            Save
          </Button>
          <Button variant="secondary" onClick={props.closeHandler()}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export interface PlateEditModalPropsInterface {
  show: boolean;
  title: string;
  description: string;
  saveHandler: Function;
  closeHandler: Function;
  id: string;
  licencePlate: string;
  ownerName: string;
  lpOnChange: Function;
  ownerOnChange: Function;
  imageData?: string;
}
