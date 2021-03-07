import {
  Action, State,
} from './interfaces';
import ACTIONS from './actions';

export default (state: State, action: Action): State => {
  switch (action.type) {
    case ACTIONS.setRepositories: {
      return {
        ...state,
        repos: action.payload.res.items,
        totalCount: action.payload.res.total_count,
        isIncomplete: action.payload.res.incomplete_results,
        keyword: action.payload.keyword,
      };
    }
    case ACTIONS.concatRepositories: {
      return {
        ...state,
        page: action.payload.page,
        isIncomplete: action.payload.res.incomplete_results,
        repos: state.repos.concat(action.payload.res.items),
      };
    }
    default:
      return state;
  }
};
