// Copyright (c) Astraeus Health Corporation 2022

/*
This is a React app that uses Redux store with a reducer and a middleware.

Your assignment is to make it more readable, and also add some functionality.

Specifically, please consider doing the following, in no particular order:
 1) Replace single-letter variable names with something more descriptive. ✅
 2) Provide comments for each of the functions.
 3) Provide a general comment for the entire program, describing its purpose.
 4) Replace type any with something more specific. ✅
 5) Do not allow timer to increment counter past 10. ✅
 6) Trigger an alert when counter reaches 20. ✅
 7) If counter goes below zero, make timer decrement rather than increment it. ✅
 8) Add a drop-down to select increment and decrement step between 1, 2, and 3. ✅
 9) Use monospace font for all text on the page. ✅
 10) Create unit tests for increment, decrement and counter functions.
 11) Create package configuration that could be used to serve the page. ✅
 12) Change App to log the timestamp of when that component did mount. ✅
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

const ActionTitles = {
  Increment: "increment",
  Decrement: "decrement",
  StepChange: "stepChange",
} as const;
type ActionType = typeof ActionTitles[keyof typeof ActionTitles];
type Actions = ReturnType<ActionCreatorWithPayload<number, ActionType>>;

const increment = createAction<number, ActionType>(ActionTitles.Increment);
const decrement = createAction<number, ActionType>(ActionTitles.Decrement);
const stepChange = createAction<number, ActionType>(ActionTitles.StepChange);

/**
 * Reducer function
 * @param state
 * @param action
 * @returns
 */
const counter = (previousState = { count: 0, step: 1 }, action: Action<ActionType>) => {
  let newState = previousState;
  if (increment.match(action)) {
    newState = { ...previousState, count: previousState.count + action.payload };
  } else if (decrement.match(action)) {
    newState = { ...previousState, count: previousState.count - action.payload };
  } else if (stepChange.match(action)) {
    newState = { ...previousState, step: action.payload };
  }
  if (newState.count === 20) {
    window.alert("Counter reached 20.");
  }
  return newState;
};

const root = combineReducers({ counter });
type RootState = ReturnType<typeof root>;

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

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
