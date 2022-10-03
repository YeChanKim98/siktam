import React, { useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import UpdateAcc from './contents/UpdateAcc';
import WithdrawAcc from './contents/WithdrawAcc';
import MyReserve from './contents/MyReserve';
import MyReview from './contents/MyReview';
import MySimpleReview from './contents/MySimpleReview';
import Inquery from './contents/Inquiry';
import MypageMenu from './MypageMenu';

const Mypage = () => {

    const login_id = window.sessionStorage.getItem('user_id')
    if(login_id === null){
        window.location.replace('/service/search'); // 히스토리를 남기지 않음 : 뒤로가기를 하더라도 이전페이지
        alert('로그인이 필요합니다');
    }else{
        return(
            <div className='myPage'>
                <MypageMenu/>
                <div className="mypageContent">
                    <Routes>
                        <Route path={'account/update'} element={<UpdateAcc />} />
                        <Route path={'*'} element={<UpdateAcc />} /> {/* 기본 랜더링 */}
                        <Route path={'account/withdraw'} element={<WithdrawAcc />} />
                        <Route path={'mySimpleReview'} element={<MySimpleReview />}/>
                        <Route exec path={'myReview'} element={<MyReview />}/>
                        <Route path={'myReserve'} element={<MyReserve />}/>
                        <Route path={'inquery'} element={<Inquery />}/>
                    </Routes>
                </div>
            </div>
        );
    };
}

export default Mypage;


