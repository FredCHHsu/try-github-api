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
        keyword: action.payload.keyword,
        page: 1,
      };
    }
    case ACTIONS.concatRepositories: {
      return {
        ...state,
        page: action.payload.page,
        repos: state.repos.concat(action.payload.res.items),
      };
    }
    case ACTIONS.showError: {
      return {
        ...state,
        errorMsg: action.payload.errorMsg,
      };
    }
    case ACTIONS.clearError: {
      return {
        ...state,
        errorMsg: '',
      };
    }
    default:
      return state;
  }
};
