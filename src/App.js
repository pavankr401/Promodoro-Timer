import React from 'react';
import beep from './Audio/beep.wav';
import './App.css';



class Promodoro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      break: "5",
      session: "25",
      sessionComplete: true,
      minutes: "25",
      seconds: "00",
      togglePlay: true,
      isDisabled: false,
    };
    this.clockify = function(mins, secs) {
      let min = (Number(mins) < 10) ? '0' + Number(mins) : mins;
      let sec = (Number(secs) < 10) ? '0' + Number(secs) : secs;
    
      return min + ":" + sec;
    }


    this.handleBreakDecrease = this.handleBreakDecrease.bind(this);
    this.handleBreakIncrease = this.handleBreakIncrease.bind(this);
    this.handleSessionDecrease = this.handleSessionDecrease.bind(this);
    this.handleSessionIncrease = this.handleSessionIncrease.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.play = this.play.bind(this);
    this.clockify = this.clockify.bind(this);
  }
  handleBreakDecrease() {
    this.setState((state) => {
      if (state.break > 1) {

        if (document.getElementById('timer-label').innerText === 'Break') {
          return {break: Number(state.break) - 1, minutes: Number(state.break) -1, seconds: '00'};
        }
        else {
          return { break: Number(state.break) - 1 };
        }
      }

    })
  }
  handleBreakIncrease() {
    this.setState((state) => {
      if (state.break < 60) {
        if (document.getElementById('timer-label').innerText === 'Break') {
          return {break: Number(state.break) + 1, minutes: Number(state.break) +1, seconds: '00'};
        }
        else {
          return { break: Number(state.break) + 1 };
        }
      }
    })
  }
  handleSessionDecrease() {
    this.setState((state) => {
      if (Number(state.session) > 1) {

        return { session: (Number(state.session) - 1) + "", minutes: Number(state.session) - 1, seconds: '00' };
      }
    })
  }
  handleSessionIncrease() {
    this.setState((state) => {
      if (Number(state.session) < 60) {
        return { session: (Number(state.session) + 1) + "", minutes: Number(state.session) + 1, seconds: '00' };
      }
    })
  }
  handleReset() {
    this.setState({ break: 5, session: "25", minutes: "25", seconds: "00", sessionComplete: true, togglePlay: true, isDisabled: false })
    clearInterval(this.interval);
    document.getElementById('beep').pause();
    document.getElementById('beep').currentTime = 0;

    document.getElementById('timer-label').innerHTML = "Session";
    document.getElementById('timer-label').style.color = "white";
    document.getElementById('time-left').style.color = "white";
    document.getElementById('play-icon').classList.remove('fa-pause');
    document.getElementById('play-icon').classList.add('fa-play');
  }

  tick() {
    this.setState(state => {
      let timerlabel = document.getElementById('timer-label');
      let timeLeft = document.getElementById('time-left');
      let audioBit = document.getElementById('beep');

      

      if (Number(state.minutes) === 0) {
        timerlabel.style.color = "red";
        timeLeft.style.color = "red";
      }
      else {
        timerlabel.style.color = "white";
        timeLeft.style.color = "white";
      }

      if (Number(state.minutes) === 0 && Number(state.seconds) === 0) {
        audioBit.currentTime = 0;
        audioBit.play();

        if (state.sessionComplete) {
          timerlabel.innerHTML = 'Break';
          return { minutes: state.break, sessionComplete: false };
        }
        else {
          timerlabel.innerHTML = 'Session';
          return { minutes: state.session, sessionComplete: true };
        }
      }
      if (Number(state.seconds) === 0) {
        return { seconds: 59, minutes: Number(state.minutes) - 1 };
      }
      else {
        let sec = (state.seconds < 11) ? '0' + (state.seconds - 1) : (state.seconds - 1);
        return { seconds: sec };
      }
    })

  }


  play() {
    this.setState((state) => ({ togglePlay: !(state.togglePlay), isDisabled: !(state.isDisabled) }));

    if (this.state.togglePlay) {
      document.getElementById('play-icon').classList.remove('fa-play');
      document.getElementById('play-icon').classList.add('fa-pause');


      this.interval = setInterval(() => this.tick(), 1000);
    }
    else {
      document.getElementById('play-icon').classList.remove('fa-pause');
      document.getElementById('play-icon').classList.add('fa-play');

      document.getElementById('beep').pause();
      clearInterval(this.interval);
    }
  }


  render() {
    return (
      <div>
        <header><h1>Promodoro Clock</h1></header>
        <div id="container">
          <div className='box'>
            <div id="break-label" className='label'>Break Length</div>
            <div className="subbox">
              <button disabled={this.state.isDisabled} id="break-decrement" className="btn" onClick={this.handleBreakDecrease}><i class="fa fa-arrow-down" aria-hidden="true"></i></button>
              <div id="break-length" className='time-limit'>{this.state.break}</div>
              <button disabled={this.state.isDisabled} id="break-increment" className="btn" onClick={this.handleBreakIncrease}><i class="fa fa-arrow-up" aria-hidden="true"></i></button>
            </div>
          </div>
          <div className='box'>
            <div id="session-label" className='label'>Session Length</div>
            <div className="subbox">
              <button disabled={this.state.isDisabled} id="session-decrement" className="btn" onClick={this.handleSessionDecrease}><i className="fa fa-arrow-down" aria-hidden="true"></i></button>
              <div id="session-length" className='time-limit'>{this.state.session}</div>
              <audio src={beep} id="beep" />
              <button disabled={this.state.isDisabled} id="session-increment" className="btn" onClick={this.handleSessionIncrease}><i className="fa fa-arrow-up" aria-hidden="true"></i></button>
            </div>
          </div>
        </div>
        <div id='timer'>
          <div id='timer-border'>
            <div id="timer-label" className='label'>Session</div>
            <div id="time-left">{this.clockify(this.state.minutes ,this.state.seconds)}</div>
          </div>
        </div>
        <div id="controls">
          <button id="start_stop" className="btn" onClick={this.play}><i id="play-icon" class="fa fa-play" aria-hidden="true"></i></button>
          <button id="reset" className="btn" onClick={this.handleReset}><i class="fa fa-refresh" aria-hidden="true"></i></button>
        </div>
        <div id="author">
          <p>Designed and Coded by</p>
          <p>pavan kumar</p>
        </div>
      </div>);
  }
}

export default Promodoro;