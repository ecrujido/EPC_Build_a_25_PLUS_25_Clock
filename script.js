// Import necessary React and ReactDOM hooks and libraries
const { useState, useEffect, useRef } = React;
const { render } = ReactDOM;

// Main component of Pomodoro Clock application, which contains the logic and UI.
function App() {
  // State variables initialized with an initial value and a corresponding setter function.
  const [displayTime, setDisplayTime] = useState(25 * 60);
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timerOn, setTimerOn] = useState(false);
  const [breakOn, setBreakOn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  // const [audio, setAudio] = useState("./Alarm05.mp3");
  const [audio, setAudio] = useState("https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav");


  // Toggle between light/dark mode, updating the HTML document accordingly
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  /**
   * Effect hook that updates the class on the HTML document element based on the darkMode state.
   * @effect
   * @param {boolean} darkMode - The state variable that toggles dark mode
   */
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
  }, [darkMode]);

  /**
   * Converts the time value given in seconds to a string in MM:SS format.
   * @function
   * @param {number} time - The time in seconds to format
   * @returns {string} The formatted time in MM:SS format, where "mm" represents
   * the number of minutes and "ss" represents the number of seconds passed as the argument `time`. The
   * minutes and seconds are padded with a leading zero if they are less than 10.
   */
  const timeFormat = (time) => {
    let minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    let seconds = (time % 60).toString().padStart(2, "0");
    return minutes + ":" + seconds;
  };

  /**
   * Handles incrementing/decrementing the break/session length based on the type and amount provided.
   * @function
   * @param {string} type - A string that specifies whether the increment/decrement is for the break/session.
   * @param {number} amount - The amount to increment/decrement break/session by.
   * @returns If the `type` parameter is break/session and the `breakLength`/`sessionLength`
   * is less than or equal to 1 or greater than or equal to 60, nothing is returned,
   * setting mivalue of 1min and max value of 60min. In the end the code is updating the session length
   * and display time based on the previous session length and the amount passed as a parameter.
   * It multiplies the updated session length by 60 to convert it to seconds and sets it as the new display time.
   */

  const handleIncrementDecrement = (type, amount) => {
    if (type === "break") {
      if (breakLength <= 1 || breakLength >= 60) {
        return;
      }
      setBreakLength((prev) => prev + amount);
    } else if (type === "session") {
      if (sessionLength <= 1 || sessionLength >= 60) {
        return;
      }
      setSessionLength((prev) => prev + amount);
      setDisplayTime((sessionLength + amount) * 60);
    }
  };

  /**
   * Starts or stops the timer depending on its current state
   * @function
   * @returns {void}
   * @description
   * This function starts the timer by setting an interval and updating the display time every second
   * until the time runs out. If the timer is already on, it stops it by clearing the interval.
   * If the time runs out and it's not currently on break, it plays an audio notification and starts a break session.
   * If the time runs out and it's currently on break, it plays an audio notification and starts a new session.
   */
  const startTimer = () => {
    let breakOnVar = breakOn;
    if (timerOn) {
      clearInterval(timerOn);
      setTimerOn(false);
    } else if (!timerOn) {
      let interval = setInterval(() => {
        setDisplayTime((prev) => {
          if (prev === 0 && !breakOnVar) {
            playAudio();
            breakOnVar = true;
            setBreakOn(true);
            return breakLength * 60;
          } else if (prev === 0 && breakOnVar) {
            playAudio();
            breakOnVar = false;
            setBreakOn(false);
            return sessionLength * 60;
          }
          {
            return prev - 1;
          }
        });
      }, 1000);
      setTimerOn(interval);
    }
  };

  /**
   * Resets the timer and all state variables to their initial values.
   * Clears interval for both timer and break
   * Pauses audio and resets its current time to 0
   * @function
   */

  const reset = () => {
    setBreakLength(5);
    setSessionLength(25);
    setDisplayTime(25 * 60);
    setTimerOn(false);
    setBreakOn(false);
    clearInterval(timerOn);
    clearInterval(breakOn);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  /**
   * Ref to the audio element used for playing the alarm sound
   * @type {React.MutableRefObject<HTMLAudioElement>}
   */
  const audioRef = useRef();

  /**
   * Plays the audio element at the current time, which is used in the `startTimer` function
   * to play an audio notification when the timer runs out.
   */
  const playAudio = () => {
    audioRef.current.currentTime = 0;
    audioRef.current.play();
  };

  /**
   * Returns the CSS class name for the timer display element based on the remaining time.
   * If the remaining time is less than 60 seconds, the class "timedisplay-flash" is returned.
   * Otherwise, an empty string is returned.
   * @returns {string} The CSS class name for the timer display element
   */
  const getTimerClassName = () => {
    if (displayTime < 60) {
      return "timedisplay-flash";
    }
    return "";
  };

  /**
   * React component that renders a Pomodoro Clock timer.
   * The app has two parts: a settings section and a timer section.
   * The settings section has two boxes with buttons that allow the user to set the break and session length.
   * The timer section shows a countdown timer and a label indicating the current session/break, and buttons to start/pause and reset the timer.
   * The component also includes a toggle button to switch between light and dark mode.
   * Within the footer there is link to the developer's profile page on freeCodeCamp website.
   * The component is designed to help users manage their time and increase productivity.
   * @param {number} breakLength - The length of the break in minutes.
   * @param {number} sessionLength - The length of the session in minutes.
   * @param {boolean} isSessionActive - The flag indicating whether the timer is currently in a session or a break.
   * @param {number} timeLeft - The remaining time in seconds for the current session/break.
   * @param {function} handleIncrementDecrement - The function to be called when the user clicks the increment/decrement buttons to change the break/session length.
   * @param {function} toggleDarkMode - The function to be called when the dark mode is toggled.
   * @param {boolean} darkMode - The flag indicating whether to use dark mode or not.
   * @returns {JSX.Element} - The HTML code for the React component that renders the Pomodoro Clock timer.
   */

  return (
    <div className="timer">
      <h1 className="text-center m-5 title">
        Pomodoro Clock
        <button
          className="btn btn-lg float-end p-3 drkmdbtn"
          onClick={toggleDarkMode}
        >
          {darkMode ? (
            <i className="fa-solid fa-sun"></i>
          ) : (
            <i className="fa-solid fa-moon"></i>
          )}
        </button>
      </h1>
      <div className="settetrs d-flex max-vh-100 max-vw-100 justify-content-evenly">
        <div className="box row justify-content-evenly">
          <h2 className="text-center" id="break-label">
            Break
          </h2>
          <button
            className="btn btn-info col more"
            id="break-increment"
            onClick={() => handleIncrementDecrement("break", 1)}
          >
            <i class="fa-solid fa-caret-up"></i>
          </button>
          <h2 className="col text-center" id="break-length">
            {breakLength}
          </h2>
          <button
            className="btn col less"
            id="break-decrement"
            onClick={() => handleIncrementDecrement("break", -1)}
          >
            <i class="fa-solid fa-caret-down"></i>
          </button>
        </div>

        <div className="box row justify-content-evenly">
          <h2 className="text-center" id="session-label">
            Session
          </h2>
          <button
            className="btn btn-sm col more"
            id="session-increment"
            onClick={() => handleIncrementDecrement("session", 1)}
          >
            <i class="fa-solid fa-caret-up"></i>
          </button>
          <h2 className="col text-center" id="session-length">
            {sessionLength}
          </h2>
          <button
            className="btn btn-sm col less"
            id="session-decrement"
            onClick={() => handleIncrementDecrement("session", -1)}
          >
            <i class="fa-solid fa-caret-down"></i>
          </button>
        </div>
      </div>

      <div className="pt-5 d-flex max-vh-100 max-vw-100 justify-content-center">
        <div className="container mt-5">
          <h2 className="mt-2" id="timer-label">
            {breakOn ? "Break" : "Session"}
          </h2>
          <audio ref={audioRef} src={audio} id="beep" />
          <div className="col p-3 mb-3">
            <h1
              className={`timedisplay ${getTimerClassName()} `}
              id="time-left"
            >
              {timeFormat(displayTime)}
            </h1>
          </div>
          <button className="btn less" id="start_stop" onClick={startTimer}>
            {timerOn ? (
              <i className="fa-solid fa-pause"></i>
            ) : (
              <i className="fa-solid fa-play"></i>
            )}
          </button>
          <button className="btn more" id="reset" onClick={reset}>
            <i class="fa-solid fa-rotate"></i>
          </button>
        </div>
      </div>
      <div className="footer p-5">
        Made with <i className="fa-regular fa-heart fa-xs"></i> by
        <a
          href="https://www.freecodecamp.org/NanaNiki"
          target="_blank"
          className="nana"
        >
          {" "}
          Nicol
        </a>
      </div>
    </div>
  );
}

/**
 * Renders the App component to the DOM.
 * @function
 * @name render
 * @param {ReactElement} App - The root component of the application.
 * @param {HTMLElement} root - The DOM element to which the App component should be rendered.
 */
ReactDOM.render(<App />, document.getElementById("root"));