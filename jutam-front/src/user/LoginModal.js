import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginModal.css';

const LoginModal = (props) => {

    // 열기, 닫기, 모달 헤더 텍스트를 부모로부터 받아옴
    const { open, close, header } = props;

    // 엑시오스 객체
    const api = axios.create({
        baseURL : 'http://localhost:8080/api',
        withCredentials : true
    });

    // ID,PW 변수
    let [id, setId] = useState('');
    let [password, setPassword] = useState('');

    // 로그인 결과 상수
    const Incorrect_Password = 'Incorrect_Password', Not_Exist_ID  = 'Not_Exist_ID';

    // 로그인
    function requestLogin(){
        api.post('/user/login',{id : id, password : password})
        .then((Result)=>{
            var resCode = Result.data;
            console.log('로그인 요청 결과 : '+resCode);
            setPassword(''); // 실패, 성공 두 경우 모두 지우므로 if위에 기입
            if(resCode===Incorrect_Password){
                alert('비밀번호가 일치하지 않습니다.');
                document.getElementById('password').focus();
            }else if(resCode===Not_Exist_ID){
                alert('존재하지 않는 계정입니다.');
                document.getElementById('id').focus();
            }else if(resCode===id){
                window.sessionStorage.setItem("user_id",id);
                window.location.reload();
            }
        }).catch((Error)=>{
            console.log(Error);
        })
    }

    return (
    // 모달이 열릴때 openModal 클래스가 생성된다.
    <div className={open ? 'openModal modal' : 'modal'}>
        {open ? (
        <section>
            <header>
                {header}
                <button className="close" onClick={close}>&times;</button>
            </header>
            <main className='LoginModalMain'>
                <form className='loginForm'>
                    <div>
                        <input type="text" id="id" class="input is-primary" onChange={(e)=>{setId(e.target.value)}} value={id} placeholder="아이디" />
                    </div>
                    <div>
                        <input type="password" id="password" class="input is-primary" 
                            onChange={(e)=>{setPassword(e.target.value)}} onKeyPress={(e)=>{if(e.key=='Enter'){requestLogin();}}}
                            value={password} placeholder="비밀번호" />
                    </div>
                    <div>
                        <button type="button" class="button is-primary" onClick={requestLogin}>로그인</button>
                    </div>
                </form>
                <div className='accountAction'>
                    <span> <Link to='/user/account/find'>계정찾기</Link> </span>
                    <span> <pipe>|</pipe> </span>
                    <span> <Link to='/user/join'>회원가입</Link> </span>
                </div>
            </main>
            <footer></footer> 
        </section>
        ) : null}
    </div>
    );
};

export default LoginModal;


