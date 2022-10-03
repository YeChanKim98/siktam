// 리뷰관련 페이지 중 어떤 페이지를 반환할지 정하고, 반환하는 파일
import './Mypage.css'
import 'bulma/css/bulma.min.css';
import React from 'react';
import { Link } from 'react-router-dom';

const MypageMenu = () =>{


    return (
        <div className='sideMenu'>
            <div className='info'>
                <div className='subtext'>My Page</div>
                <div className='myName'>유저_1</div>
                <div className='regDate'>가입일 : 2022.01.01</div>
                <div className='myLocate'>지역 : 서울 강서구</div>
            </div>

            <div className='menu'>
                <div className='category'>내 정보</div>
                <ul>
                    <Link to='account/update'><li>회원정보 수정</li></Link>
                    <Link to='account/withdraw'><li>회원 탈퇴</li></Link>
                </ul>

                <div className='category'>내가 쓴 리뷰</div>
                <ul>
                    <Link to='mySimpleReview'><li>한줄 리뷰</li></Link>
                    <Link to='myReview'><li>상세 리뷰</li></Link>
                </ul>
                
                <div className='category'>예약</div>
                <ul>
                    <Link to='myReserve'><li>전체 예약 정보</li></Link>
                </ul>

                <div className='category'>문의</div>
                <ul>
                    <Link to='inquery'><li>1:1문의</li></Link>
                </ul>
            </div>
        </div>
    );
}

export default MypageMenu;