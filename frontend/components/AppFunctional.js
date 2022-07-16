import React, { useState } from 'react'
import axios from 'axios';

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  const [message, setMessage] = useState(initialMessage);
  const [index, setIndex] = useState(initialIndex);
  const [steps, setSteps] = useState(initialSteps);
  const [email, setEmail] = useState(initialEmail);

  function getXY() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const x = index % 3 + 1;
    const y = Math.floor(index/3) + 1;
    
    return [x, y];
  }

  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    const coords = getXY();
    return `Coordinates (${coords[0]}, ${coords[1]})`;
  }
  
  function reset() {
    // Use this helper to reset all states to their initial values.

    setIndex(initialIndex);
    setMessage(initialMessage);
    setSteps(initialSteps);
    setEmail(initialEmail);

  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
  
    if (direction === 'left' && (index)%3 !== 0) {
      setSteps(steps + 1);
      return index - 1;
    } else if (direction === 'up' && index-3 >= 0) {
      setSteps(steps + 1);
      return index - 3;
    } else if (direction === 'right' && (index+1)%3 !== 0) {
      setSteps(steps + 1);
      return index + 1;
    } else if (direction === 'down' && index+3 <= 8) {
      setSteps(steps + 1);
      return index + 3
    } else {
      //console.log('no')
      setMessage(`You can't go ${direction}`)
      return index;
    }
  }

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.

    //console.log(getNextIndex(evt.target.id))
    setMessage(initialMessage);
    setIndex(getNextIndex(evt.target.textContent.toLowerCase()))
  }

  function onChange(evt) {
    setEmail(evt.target.value)
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
    const xyValues = getXY();
    const postObj = {
      "x": xyValues[0],
      "y": xyValues[1],
      "steps": steps,
      "email": email
    }
    
    console.log(postObj)
    axios.post(`http://localhost:9000/api/result`, postObj)
      .then(res => {
        setMessage(res.data.message)
        setEmail(initialEmail)
      })
      .catch(err => {
        setMessage(err.response.data.message)
      })



  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">{`You moved ${steps} time${steps !== 1 ? 's' : ''}`}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button onClick={move} id="left">LEFT</button>
        <button onClick={move} id="up">UP</button>
        <button onClick={move} id="right">RIGHT</button>
        <button onClick={move} id="down">DOWN</button>
        <button onClick={reset} id="reset">reset</button>
      </div>
      <form>
        <input onChange={onChange} value={email} id="email" type="email" placeholder="type email" />
        <input onClick={onSubmit} id="submit" type="submit" />
      </form>
    </div>
  )
}
