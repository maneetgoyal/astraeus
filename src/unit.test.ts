import { increment, decrement, ActionTitles} from "./index";

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