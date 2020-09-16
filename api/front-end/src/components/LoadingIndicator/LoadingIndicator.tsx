import {Spinner} from "react-bootstrap";
import styles from "./LoadingIndicator.module.css";
import React from "react";

/**
 * Centered loading indicator
 * @constructor
 */
export const LoadingIndicator = () => {
  return (
    <div className="d-flex justify-content-center">
      <Spinner animation="grow" variant="light" className={styles.SpinnerDiv}/>
    </div>
  );
};
