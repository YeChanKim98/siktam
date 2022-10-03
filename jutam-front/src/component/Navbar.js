import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginModal from '../user/LoginModal';
import './Navbar.css';

const Navbar = () => {

    // useState를 사용하여 open상태를 변경한다. (open일때 true로 만들어 열리는 방식)
    const [modalOpen, setModalOpen] = useState(false);
    const openModal = () => {
        setModalOpen(true);
    };
    const closeModal = () => {
        setModalOpen(false);
    };

    // 엑시오스 객체
    const api = axios.create({
        baseURL : 'http://localhost:8080/api',
        withCredentials : true
    });

    // 로그인 관련 정보
    const login_id = window.sessionStorage.getItem('user_id'); // 임의로 세션스토리지에 값으 추가한 사용자에 대한 조치 필요
    const Success_User_Logout = 'Success_User_Logout'; // 로그아웃 성공 
    const Incorrect_Request = 'Incorrect_Request'; // 올바르지 않은 요청(실패)

    // 로그아웃
    function requestLogout(){
        api.post('/user/logout',{id : login_id})
        .then((Result)=>{
            var resCode = Result.data;
            console.log('로그아웃 요청 결과 : '+resCode);
            if(resCode==Success_User_Logout){
                window.sessionStorage.removeItem("user_id"); // 세션에서 로그인 정보 삭제
                alert('이용해 주셔서 감사합니다.');
                window.location.replace('/service/search');
            }else if(resCode==Incorrect_Request){
                alert('올바르지 않은 요청입니다.');
            }
        }).catch((Error)=>{
            console.log(Error);
        })
    }

    // 로그인 여부에 따른 랜더링
    function checkLonginRender(){
        if(login_id == null){
            return(
                <div className="buttons">
                    <a className="button is-primary">
                        <strong>회원가입</strong>
                    </a>
                    <a className="button is-primary" onClick={openModal} >로그인</a>
                    <LoginModal open={modalOpen} close={closeModal} header="로그인">
                    </LoginModal>
                </div>
                
            );} // No Login User
        else{
            return(
                <div className="navbar-item has-dropdown is-hoverable">
                    <a className="navbar-link">{login_id}</a>
                    <div className="navbar-dropdown is-right">
                        <Link to='/service/user/mypage'>
                            <a className="navbar-item">마이페이지</a>
                        </Link>
                        <a className="navbar-item">
                            로그인 전용 01
                        </a>
                        <hr className="navbar-divider"/>
                        <a className="navbar-item" onClick={requestLogout}>
                            로그아웃
                        </a>
                    </div>
                </div>
            );
        }
    }
    return(
    <nav className="navbar is-success" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
            <a className="navbar-item" href="/service/search">
                {/* <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28"> */}
                <b><b className="title">식</b>당</b>
                <b><b className="title">탐</b>색 서비스</b>
            </a>

            <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            </a>
        </div>

        <div id="navbarBasicExample" className="navbar-menu">
            <div className="navbar-start">

                <a className="navbar-item">
                    주탐이란?
                </a>

                <a className="navbar-item">
                    주변 검색
                </a>

                <a className="navbar-item">
                    게시판
                </a>


                <div className="navbar-item has-dropdown is-hoverable">
                    <a className="navbar-link">
                    기타 서비스
                    </a>

                    <div className="navbar-dropdown">
                    <a className="navbar-item">
                        서비스 1
                    </a>
                    <a className="navbar-item">
                        서비스 2
                    </a>
                    <a className="navbar-item">
                        서비스 3
                    </a>
                    <hr className="navbar-divider"/>
                    <a className="navbar-item">
                        서비스 4
                    </a>
                    </div>
                </div>
            </div>

            {/* 세션에 따라 내용 변경 */}
            <div className="navbar-end">
                <div className="navbar-item">


{/* 
                    <div class="buttons">
                        <a class="button is-primary">
                            <strong>회원가입</strong>
                        </a>
                        <a class="button is-primary" onClick={openModal} >로그인</a>
                        <LoginModal open={modalOpen} close={closeModal} header="로그인">
                        </LoginModal>
                    </div> */}
                    {checkLonginRender()}


                </div>
            </div>
        </div>

    </nav>
    );
}
export default Navbar;

// 창 크기에 따른 메뉴 압축 동작 안 함(햄버거 버튼)