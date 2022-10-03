import axios from 'axios';
import React from 'react';
import './style/WithdrawAcc.css';

function WithdrawAcc(){

    const api = axios.create({
        baseURL : 'http://localhost:8080/api',
        withCredentials : true
    });

    // 탈퇴
    function withdraw(){
        api.post('/user/withdraw/'+window.sessionStorage.getItem('user_id'),)
        .then((Reviews)=>{
            alert('탈퇴가 정상적으로 진행되었습니다.\n이용해 주셔서 감사합니다');
        }).catch((Error)=>{
            alert('탈퇴에 실패했습니다\n',Error);
        })
    }

    function withdraw(e){
        e.preventDefault();
        withdraw(); // 탈퇴
        window.sessionStorage.removeItem('user_id') // 로그아웃
        window.location.href = 'http://localhost:8080/'; // 메인으로 이동
    }

    return(
        <>
            <center>
                <div className='title'><b>회원 탈퇴</b></div>
                <div>회원 탈퇴 후 정보 복구는 불가능 합니다.</div>
                <div><b>비밀번호</b>입력 후 탈퇴가 진행됩니다.</div>
                
                <br/>
                <div className='drawForm'>
                    <input className='input is-info' type='password' placeholder='input password'></input>
                    <button type='submit' className="button is-info is-responsive" onSubmit={withdraw}>탈퇴</button>
                </div>

            </center>
        </>
    );
}

export default WithdrawAcc;