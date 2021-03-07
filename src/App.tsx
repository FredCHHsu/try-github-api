import { Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import {
  debounceTime, distinctUntilChanged, filter, map, throttleTime,
} from 'rxjs/operators';
import { useEventCallback } from 'rxjs-hooks';
import React, {
  ChangeEvent, ReactElement, UIEvent, useReducer,
} from 'react';
import _get from 'lodash/get';

import {
  Action, RepositoriesRes, State,
} from './interfaces';
import ACTIONS from './actions';
import reducer from './reducer';

import './App.scss';

const searchUrl = 'https://api.github.com/search/repositories';
const getRepositories$ = (keyword: string, page = 1) => ajax(`${searchUrl}?q=${keyword}&per_page=20&page=${page}`);

export const initialValue: State = {
  keyword: '',
  repos: [],
  totalCount: 0,
  isIncomplete: false,
  page: 1,
};

function App(): ReactElement {
  console.log('render');

  const [state, dispatch] = useReducer(reducer, initialValue);

  const [handleChange] = useEventCallback(
    (event$: Observable<ChangeEvent<HTMLInputElement>>) => event$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((e) => {
        getRepositories$(e.target.value).subscribe(
          (res) => dispatch({
            type: ACTIONS.setRepositories,
            payload: {
              keyword: e.target.value,
              res: res.response as RepositoriesRes,
            },
          }),
          (err) => console.log(_get(err, 'response.message', '')),
        );
      }),
    ),
  );

  const handleScroll = () => {};

  return (
    <div
      className="App"
      style={{ maxHeight: '100vh', overflow: 'scroll' }}
      onScroll={handleScroll}
    >
      <div style={{ paddingTop: 12, marginBottom: 12 }}>
        <span>Search Github: </span>
        <input
          type="text"
          onChange={handleChange}
        />
      </div>
      {state.repos.map((item) => (
        <div key={item.id}>
          <div style={{
            marginBottom: 8,
            border: '1px solid #ccc',
            borderRadius: 8,
            padding: '12px 24px',
            width: 320,
          }}
          >
            {`${item.full_name} (${item.stargazers_count})`}
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
