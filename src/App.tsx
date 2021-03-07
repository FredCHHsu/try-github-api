import { Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import {
  debounceTime, distinctUntilChanged, filter, map, withLatestFrom,
} from 'rxjs/operators';
import { useEventCallback } from 'rxjs-hooks';
import React, {
  ChangeEvent, ReactElement, UIEvent, useCallback, useReducer,
} from 'react';
import _get from 'lodash/get';

import {
  RepositoriesRes, State,
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
  page: 1,
  errorMsg: '',
};

function App(): ReactElement {
  const [state, dispatch] = useReducer(reducer, initialValue);

  const handleAjaxError = useCallback((err) => {
    const responseMsg = _get<string>(err, 'response.message', '');
    dispatch({
      type: ACTIONS.showError,
      payload: {
        errorMsg: responseMsg.includes('API rate limit exceeded')
          ? 'API rate limit exceeded, please wait a minute'
          : responseMsg,
      },
    });
  }, []);

  const [handleChange] = useEventCallback(
    (event$: Observable<ChangeEvent<HTMLInputElement>>) => event$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((e) => {
        if (!e.target.value) return;
        getRepositories$(e.target.value).subscribe(
          (res) => dispatch({
            type: ACTIONS.setRepositories,
            payload: {
              keyword: e.target.value,
              res: res.response as RepositoriesRes,
            },
          }),
          (err) => handleAjaxError(err),
        );
      }),
    ),
  );

  const [handleScroll] = useEventCallback(
    (event$: Observable<UIEvent<HTMLElement>>,
      state$: Observable<unknown>,
      inputs$: Observable<[State]>) => event$.pipe(
      filter((e) => {
        const element = e.currentTarget;
        const bottom = element.scrollHeight - element.scrollTop === element.clientHeight;
        if (bottom) return true;
        return false;
      }),
      withLatestFrom(inputs$),
      map(([e, [stat]]) => {
        getRepositories$(stat.keyword, stat.page + 1).subscribe(
          (res) => dispatch({
            type: ACTIONS.concatRepositories,
            payload: {
              page: stat.page + 1,
              res: res.response as RepositoriesRes,
            },
          }),
          (err) => handleAjaxError(err),
        );
      }),
    ),
    undefined,
    [state],
  );

  const handleClearError = useCallback(() => {
    dispatch({ type: ACTIONS.clearError });
  }, []);

  return (
    <div
      className="App"
      style={{ maxHeight: '100vh', overflow: 'scroll' }}
      onScroll={handleScroll}
    >
      <div className={`snackbar${state.errorMsg ? ' show' : ''}`}>
        {state.errorMsg}
        <button type="button" onClick={handleClearError}>Got it</button>
      </div>
      <div style={{ paddingTop: 12, marginBottom: 12 }}>
        <span>Search Github: </span>
        <input
          type="text"
          onChange={handleChange}
        />
      </div>
      {state.repos.map((item) => (
        <a key={item.id} href={item.html_url}>
          <div className="repo-card">
            {`${item.full_name} (${item.stargazers_count})`}
          </div>
        </a>
      ))}
    </div>
  );
}

export default App;
