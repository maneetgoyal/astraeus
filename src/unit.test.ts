import { increment, decrement, ActionTitles, counter } from "./index";

it('tests increment action creator', () => {
    expect(increment(1)).toEqual({type: ActionTitles.Increment, payload: 1});
    expect(increment(2)).toEqual({type: ActionTitles.Increment, payload: 2});
    expect(increment(3)).toEqual({type: ActionTitles.Increment, payload: 3});
  });

it('tests decrement action creator', () => {
  expect(decrement(1)).toEqual({type: ActionTitles.Decrement, payload: 1});
  expect(decrement(2)).toEqual({type: ActionTitles.Decrement, payload: 2});
  expect(decrement(3)).toEqual({type: ActionTitles.Decrement, payload: 3});
});

it('tests counter reduces', () => {
  expect(counter({count: 0, step: 1}, increment(1))).toEqual({count: 1, step: 1})
  expect(counter({count: 0, step: 1}, increment(2))).toEqual({count: 2, step: 1})
  expect(counter({count: 0, step: 1}, decrement(1))).toEqual({count: -1, step: 1})
  expect(counter({count: 0, step: 1}, decrement(2))).toEqual({count: -2, step: 1})
});