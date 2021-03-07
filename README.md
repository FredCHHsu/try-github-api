### This project has deployed to [Here](https://try-github-api.herokuapp.com/)


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### 簡易說明
* 以 useReducer 代替 redux，主要記錄 request 的 keyword, page
* 以 rxjs-hooks 因應 middleware 的需求
  * 偵測輸入變動 => 濾波 => 送出查詢
  * 偵測滾動是否抵達底邊 => 根據 store 的紀錄 送出下一個查詢
  * 偵測 request 錯誤 => 顯示錯誤提示

###### 最近一邊帶著小孩進出急診室，就沒有多寫更完整的架構了 T_T
