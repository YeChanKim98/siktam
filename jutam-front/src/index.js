import React from 'react';
import ReactDOM from 'react-dom';
// import DevLink from './DevLink';
import './index.css';
// import TestIndex from './index/TestIndex';
import reportWebVitals from './reportWebVitals';
// import SimpleReview from './review/SimpleReview';
// import Review from './review/Review';
import Mypage from './mypage/Mypage';
import JuTamRouter from './JuTamRouter';
import ServiceMain from './search/SearchService'


// 모든 파일에 임포트 되는 CSS 수정
ReactDOM.render(
// {/* <JuTamRouter/>, */}
<ServiceMain/>,
  document.getElementById('root')
);

reportWebVitals();
