import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from 'axios';
// import UserRegist from './user/UserRegist';
import IndexNav from './index/IndexNav'; // 인덱스페이지 ( 접속 초기 네비게이션 페이지 )
// import Search from './search/Search';
import Service from './Service'; // 서비스 관련 페이지 : 전반적인 콘텐츠는 해당 페이지에 표시
import NotFound from './NotFound'; // 404 페이지


function JuTamRouter(){
    const api = axios.create({
        baseURL : 'http://localhost:8080/api',
        withCredentials : true,
        credentials: 'include'
    });

    return (
        <Router>
                <Routes>
                    {/* 프론트 디버깅 마무리 단계에서 exact 추가 */}
                    <Route path={"/"} element={<IndexNav />} /> 
                    <Route path={"/service/*"} element={<Service/>} />
                    <Route path={"*"} element={<NotFound/>} />
                </Routes>
        </Router>
    );
}

export default JuTamRouter;


