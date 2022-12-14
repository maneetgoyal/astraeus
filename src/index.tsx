// Copyright (c) Astraeus Health Corporation 2022

/*
This is a React app that uses Redux store with a reducer and a middleware.

Your assignment is to make it more readable, and also add some functionality.

Specifically, please consider doing the following, in no particular order:
 1) Replace single-letter variable names with something more descriptive. ✅
 2) Provide comments for each of the functions. ✅
 3) Provide a general comment for the entire program, describing its purpose. ✅
 4) Replace type any with something more specific. ✅
 5) Do not allow timer to increment counter past 10. ✅
 6) Trigger an alert when counter reaches 20. ✅
 7) If counter goes below zero, make timer decrement rather than increment it. ✅
 8) Add a drop-down to select increment and decrement step between 1, 2, and 3. ✅
 9) Use monospace font for all text on the page. ✅
 10) Create unit tests for increment, decrement and counter functions. ✅
 11) Create package configuration that could be used to serve the page. ✅
 12) Change App to log the timestamp of when that component did mount. ✅
*/

/**
 * General Comment:
 * 
 * The program represents an interplay between core redux concepts and Typescript typings.
 * It showcases how the core redux concepts can be used to manage the app state.
 * It also showcases how a Redux app could be "typed" (TS) to push code more confidently and conveniently.
 * 
 * In a more literal sense, the app showcases a "controlled" counter which can be incremented/decremented based on the used specified step sizes. 
 * The timer's behavior is peculiar in that it behaves differently when the counter reaches a negative value, when it exceeds 10, and when it reaches 20.
 */

import {
  ActionCreatorWithPayload,
  configureStore,
  createAction,
  Middleware,
} from "@reduxjs/toolkit";
import type { Action, Dispatch } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { createRoot } from "react-dom/client";
import { Provider, useDispatch, useSelector } from "react-redux";
import "./index.css";
import { useEffect } from "react";

/**
 * A registry of all the action types.
 */
export const ActionTitles = {
  Increment: "increment",
  Decrement: "decrement",
  StepChange: "stepChange",
} as const;
type ActionType = typeof ActionTitles[keyof typeof ActionTitles];
type Actions = ReturnType<ActionCreatorWithPayload<number, ActionType>>;

/**
 * All the action creators
 */
export const increment = createAction<number, ActionType>(ActionTitles.Increment);
export const decrement = createAction<number, ActionType>(ActionTitles.Decrement);
const stepChange = createAction<number, ActionType>(ActionTitles.StepChange);

/**
 * Reducer function to update the state based on step size and current count
 * @param state
 * @param action
 * @returns
 */
export const counter = (currentState = { count: 0, step: 1 }, action: Action<ActionType>) => {
  let newState = currentState;
  if (increment.match(action)) {
    newState = { ...currentState, count: currentState.count + action.payload };
  } else if (decrement.match(action)) {
    newState = { ...currentState, count: currentState.count - action.payload };
  } else if (stepChange.match(action)) {
    newState = { ...currentState, step: action.payload };
  }
  if (newState.count === 20) {
    window.alert("Counter reached 20.");
  }
  return newState;
};

/**
 * Combination of all the reducers
 */
const root = combineReducers({ counter });
type RootState = ReturnType<typeof root>;

/**
 * Redux middleware that emulates a timer by auto incrementing/decrementing the count
 * @param param0 
 * @returns 
 */
const timer: Middleware<{}, RootState, Dispatch<Actions>> = ({ dispatch, getState }) => {
  setInterval(() => {
    const {
      counter: { count, step },
    } = getState();
    if (count < 0) {
      dispatch(decrement(step));
    } else if (count + step <= 10) {
      dispatch(increment(step));
    }
  }, 1000);
  return (next: Dispatch<Actions>) => (action: Actions) => {
    next(action);
  };
};

/**
 * Redux State Store
 */
const store = configureStore({
  reducer: root,
  middleware: [timer],
});

/**
 * App React component
 * @returns 
 */
export const App = () => {
  const dispatch = useDispatch<Dispatch<Actions>>();
  const { count, step } = useSelector<RootState, RootState["counter"]>(
    (currentState) => currentState.counter
  );

  useEffect(() => {
    console.log(`App mounted on ${new Date().toLocaleString()}`);
  }, []);

  return (
    <>
      <button onClick={() => dispatch(decrement(step))}>-</button>
      {count}
      <button onClick={() => dispatch(increment(step))}>+</button>
      <select
        onChange={(e) => {
          dispatch(stepChange(Number.parseInt(e.target.value, 10)));
        }}
        value={step}
      >
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
      </select>
    </>
  );
};

const targetElement = document.getElementById("root");
if (targetElement !== null) {
  createRoot(targetElement).render(
    <Provider store={store}>
      <App />
    </Provider>
  );
}
