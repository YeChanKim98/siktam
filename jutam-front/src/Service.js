import React from 'react';
import { Routes, Route, Link } from "react-router-dom";
import Navbar from './component/Navbar'; // 네비바
import ServiceMain from './search/SearchService'; // 메인 서비스
import Map from './search/Backup/SearchService'; // 메인 서비스
import UserRegist from './user/UserRegist'; // 가입페이지
import FindAccount from './user/FindAccount'; // 내 계정 찾기
import Mypage from './mypage/Mypage'; // 마이페이지


function Service(){    
    return (
        
        <>
            {/* <Navbar/>  임시 제외  */}
            {/* <h1>베이스 서비스 페이지</h1> */}
            <div className='mainWrapper' style={{height:'100%'}}>
                <Routes>
                    <Route exec path={"user/"} >
                        <Route path={"regist"} element={<UserRegist />}/>
                        <Route path={"mypage/*"} element={<Mypage />}/>
                    </Route>
                    <Route exec path ={"/backup"} element={<Map />}/> 
                    <Route path ={"search/*"} element={<ServiceMain />}/> 
                </Routes>
            </div>
        </>
    );
}

export default Service;


