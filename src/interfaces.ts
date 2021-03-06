import ACTIONS from './actions';

export interface Repository {
  full_name: string;
  name: string;
  git_url: string;
  language: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  id: number;
}

export interface RepositoriesRes {
  incomplete_results: boolean;
  items: Repository[];
  total_count: number;
}

export interface State {
  keyword: string;
  totalCount: number;
  page: number;
  repos: Repository[];
  errorMsg: string;
}

export type Action =
  | { type: ACTIONS.setRepositories; payload: { keyword: string; res: RepositoriesRes } }
  | { type: ACTIONS.concatRepositories; payload: { page: number; res: RepositoriesRes } }
  | { type: ACTIONS.showError; payload: { errorMsg: string } }
  | { type: ACTIONS.clearError };
