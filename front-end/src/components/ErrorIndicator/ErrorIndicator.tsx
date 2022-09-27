import React from "react";
import styles from "./ErrorIndicator.module.css";

export interface ErrorIndicatorInterface {
  title: string;
  message: string;
}

const ErrorIndicator = React.memo((props: ErrorIndicatorInterface) => {
  const classes = ["justify-content-center", "text-center", styles.IndicatorMainDiv].join(' ');

  return (
    <div className={classes}>
      <h2 className={styles.IndicatorText}>{props.title}</h2>
      <div>
        <small className={styles.IndicatorText}>{props.message}</small>
      </div>
    </div>
  )
});

export default ErrorIndicator;
