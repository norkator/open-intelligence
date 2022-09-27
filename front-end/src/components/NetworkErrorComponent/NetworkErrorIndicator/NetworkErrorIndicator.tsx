import React /*, {useState, useEffect}*/ from "react";
import styles from "./NetworkErrorIndicator.module.css";
import {AxiosError} from "axios";

export interface ErrorIndicatorInterface {
  t: Function;
  axiosError: AxiosError | null;
}

const NetworkErrorIndicator = React.memo((props: ErrorIndicatorInterface) => {
  // const [inputState, setInputState] = useState({title: '', amount: ''});

  /*
  useEffect(() => {
    console.log('Run useEffect');
  }, []); // ,[] causes useEffect not to run every render cycle
  */

  const classes = ["justify-content-center", "text-center", styles.IndicatorMainDiv].join(' ');

  return (
    <div className={classes}>
      <h2 className={styles.IndicatorText}>{props.axiosError?.message}</h2>
      <div>
        <small className={styles.IndicatorText}>{props.axiosError?.config.url}</small>
      </div>
      <div>
        <small className={styles.IndicatorText}>{props.t('networkErrorIndicator.checkYourConfig')}</small>
      </div>
    </div>
  )
});

export default NetworkErrorIndicator;
