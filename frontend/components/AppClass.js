import React from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
}

export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  state = initialState;

  

  getXY = () => {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const x = this.state.index % 3 + 1;
    const y = Math.floor(this.state.index/3) + 1;
    return [x, y];
  }

  getXYMessage = () => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    const coordinates = this.getXY();
    return `Coordinates (${coordinates[0]}, ${coordinates[1]})`;
  }

  reset = () => {
    // Use this helper to reset all states to their initial values.
    this.setState(initialState)
  }

  getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    if (direction === 'left' && (this.state.index)%3 !== 0) {
      this.setState({ steps: this.state.steps + 1});
      return this.state.index - 1;
    } else if (direction === 'up' && this.state.index-3 >= 0) {
      this.setState({ steps: this.state.steps + 1});
      return this.state.index - 3;
    } else if (direction === 'right' && (this.state.index+1)%3 !== 0) {
      this.setState({ steps: this.state.steps + 1});
      return this.state.index + 1;
    } else if (direction === 'down' && this.state.index+3 <= 8) {
      this.setState({ steps: this.state.steps + 1});
      return this.state.index + 3
    } else {
      this.setState({message: `You can't go ${direction}`})
      return this.state.index;
    }
  }

  move = (evt) => {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    this.setState({ message: initialState.message });
    this.setState({ index: this.getNextIndex(evt.target.textContent.toLowerCase()) });
  }

  onChange = (evt) => {
    // You will need this to update the value of the input.
    this.setState({ email: evt.target.value })
  }

  onSubmit = (evt) => {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
    const xyValues = this.getXY();
    const postObj = {
      "x": xyValues[0],
      "y": xyValues[1],
      "steps": this.state.steps,
      "email": this.state.email
    }

    axios.post(`http://localhost:9000/api/result`, postObj)
    .then(res => {
      this.setState({ message: res.data.message})
      this.setState({ email: initialState.email })
    })
    .catch(err => this.setState({ message: err.response.data.message }))
   

    //this.reset();
  }

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">{`You moved ${this.state.steps} time${this.state.steps !== 1 ? 's' : ''}`}</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
                {idx === this.state.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button onClick={this.move} id="left">LEFT</button>
          <button onClick={this.move} id="up">UP</button>
          <button onClick={this.move} id="right">RIGHT</button>
          <button onClick={this.move} id="down">DOWN</button>
          <button onClick={this.reset} id="reset">reset</button>
        </div>
        <form>
          <input onChange={this.onChange} value={this.state.email} id="email" type="email" placeholder="type email" />
          <input onClick={this.onSubmit} id="submit" type="submit" />
        </form>
      </div>
    )
  }
}
