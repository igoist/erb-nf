import * as React from 'react';
import { useImmerReducer } from 'use-immer';

const initialState = {
  a: 0,
  b: 'textb',
  o: {
    c: 1,
    d: 'textd',
    e: {
      f: 2,
      g: 'textg',
    },
  },
};

function reducer(draft: any, action: any) {
  switch (action.type) {
    case 'reset':
      return initialState;
    case 'a+':
      draft.a++;
      break;
    case 'a-':
      draft.a--;
      break;
    case 'b+':
      draft.b = action.payload.b;
      break;
    case 'c+':
      draft.o.c++;
      break;
    case 'c-':
      draft.o.c--;
      break;
    case 'd+':
      draft.o.d = action.payload.d;
      break;
    case 'f+':
      draft.o.e.f++;
      break;
    case 'f-':
      draft.o.e.f--;
      break;
    case 'g+':
      draft.o.e.g = action.payload.g;
      break;
  }
}

const AppUseImmerReducer = () => {
  const [state, dispatch] = useImmerReducer(reducer, initialState);

  return (
    <>
      <h1>This demo is for useImmerReducer</h1>
      <h1>a: {state.a}</h1>
      <h1>b: {state.b}</h1>
      <h1>c: {state.o.c}</h1>
      <h1>d: {state.o.d}</h1>
      <h1>f: {state.o.e.f}</h1>
      <h1>g: {state.o.e.g}</h1>

      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
      <button onClick={() => dispatch({ type: 'a+' })}>a+</button>
      <button onClick={() => dispatch({ type: 'a-' })}>a-</button>
      {/* <button onClick={() => dispatch({ type: 'b+' })}>b+</button> */}
      {/* <button onClick={() => dispatch({ type: 'b-' })}>b-</button> */}
      <button onClick={() => dispatch({ type: 'c+' })}>c+</button>
      <button onClick={() => dispatch({ type: 'c-' })}>c-</button>
      <button onClick={() => dispatch({ type: 'f+' })}>f+</button>
      <button onClick={() => dispatch({ type: 'f-' })}>f-</button>

      <input
        onChange={(e) => {
          dispatch({
            type: 'b+',
            payload: {
              b: e.target.value,
            },
          });
        }}
        value={state.b}
      />
      <input
        onChange={(e) => {
          dispatch({
            type: 'd+',
            payload: {
              d: e.target.value,
            },
          });
        }}
        value={state.o.d}
      />
      <input
        onChange={(e) => {
          dispatch({
            type: 'g+',
            payload: {
              g: e.target.value,
            },
          });
        }}
        value={state.o.e.g}
      />
    </>
  );
};

export default AppUseImmerReducer;
