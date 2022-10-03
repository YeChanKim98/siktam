import axios from 'axios';
import moment from 'moment';
import React, { useState } from 'react';
import './style/UpdateAcc.css'


function UpdateAcc(){

    const api = axios.create({
        baseURL : 'http://localhost:8080/api',
        withCredentials : true
    });

    let toDay = moment(new Date()).utc().format('YYYY-MM-DD');
    let [password, setPassword] = useState('password');
    let [chkPass, setChkPass] = useState('password');
    let [nickName, setNickName] = useState('Tester');
    let [email, setEmail] = useState('1234@gmail.com');
    let [phone, setPhone] = useState('010-0000-0000');
    let [born, setBorn] = useState(1998);


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
        <div>
            <center>
                <form className='updateForm'>
                    <div className='wrapInput'>
                        <span className='col-1'>아이디</span>
                        <span className='col-2'>
                            <input className='input is-info' disabled type='text' id='user_id' value='Tester'></input>
                        </span>
                    </div>
                    <div className='wrapInput'>
                        <span className='col-1'>비밀번호</span>
                        <span className='col-2'>
                        <input className='input is-primary' id='password' type='password' onChange={(e)=>{setPassword(e.target.value);console.log(password);}}></input>
                        </span>
                    </div>
                    <div className='wrapInput'>
                        <span className='col-1'>비밀번호 재입력</span>
                        <span className='col-2'>
                        <input className='input is-primary' id='chkPass' type='password' onChange={(e)=>{setChkPass(e.target.value);console.log(chkPass);}}></input> {/*onchange에 실시간 검색*/}
                        <span id='chkMsg' hidden><br/>입력한 비밀번호화 일치하지 않습니다. 다시 입력바랍니다.</span>
                        </span>
                    </div>
                    <div className='wrapInput'>
                        <span className='col-1'>닉네임</span>
                        <span className='col-2'>
                            <input className='input is-primary' id='nickName' type='text' onChange={(e)=>{setNickName(e.target.value);console.log(nickName);}}></input>
                        </span>
                    </div>
                    <div className='wrapInput'>
                        <span className='col-1'>이메일</span>
                        <span className='col-2'>
                            <input className='input is-primary' id='email' type='email' value='1234@gmail.com'></input>
                        </span>
                        <span className='col-3'>
                            <button class='button is-info' type='button' onClick={null}>인증</button>
                            {/* 인증알고리즘 */}
                        </span>
                    </div>
                    <div className='wrapInput'>
                        <span className='col-1'>전화번호</span>
                        <span className='col-2'>
                            <input className='input is-primary' type='text' ></input>
                        </span>
                    </div>
                    <div className='wrapInput'>
                        <span className='col-1'>생년월일</span>
                        <span className='col-2'>
                            <input className='input is-primary' type='date' max={toDay} onChange={null}></input>
                        </span>
                    </div>
                    <div className='wrapSubmit'>
                        <button type='submit' className="button is-info" onSubmit={null}>회원정보 수정</button>
                    </div>
                </form>

            </center>
        </div>
    );
}

export default UpdateAcc;

// 기본 로직
// 1. 비밀번호 패턴 확인 : 포커스아웃 이벤트
// 2. 비밀번호 재입력 검사 : 일치여부 확인
// 3. 닉네임 중복검사 : 실시간 검사 후 맞으면 useState값 변경 -> 정보 변경시 반영
// 4. 이메일 인증 : 백엔드에서 난수생성 후 암호화 -> 세션 유저이름+mail 속성에 해당 값 추가 -> 입력 받은 값의 해시와 유저이름+mail 속성의 값이 일치하면 ok

// 부가 로직