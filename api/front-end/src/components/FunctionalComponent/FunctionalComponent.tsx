import React, {useState} from "react";
import {Card} from "react-bootstrap";


const FunctionalComponent = React.memo((props: any) => {
  const inputState = useState({title: '', amount: ''});

  return (
    <div>
      <Card>
        <Card.Header>
          <h3>Functional component useState testing</h3>
        </Card.Header>
        <Card.Body>
          <div>
            <small>Title from state: {inputState[0].title}</small>
          </div>
          <div>
            <input
              type="text"
              id="title"
              value={inputState[0].title}
              onChange={event => inputState[1]({title: event.target.value, amount: inputState[0].amount})}
            />
          </div>
          <small>Amount from state: {inputState[0].amount}</small>
        </Card.Body>
      </Card>
    </div>
  )
});

export default FunctionalComponent;
