import React, {useState, useEffect} from "react";
import {Card} from "react-bootstrap";


const FunctionalComponent = React.memo((props: any) => {
  const [inputState, setInputState] = useState({title: '', amount: ''});

  useEffect(() => {
    console.log('Run useEffect');
  }, []); // ,[] causes useEffect not to run every render cycle

  return (
    <div>
      <Card>
        <Card.Header>
          <h3>Functional component useState testing</h3>
        </Card.Header>
        <Card.Body>
          <div>
            <small>Title from state: {inputState.title}</small>
          </div>
          <div>
            <input
              type="text"
              id="title"
              value={inputState.title}
              onChange={event => setInputState({title: event.target.value, amount: inputState.amount})}
            />
          </div>
          <small>Amount from state: {inputState.amount}</small>
        </Card.Body>
      </Card>
    </div>
  )
});

export default FunctionalComponent;
