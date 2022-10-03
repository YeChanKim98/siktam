// 리뷰관련 페이지 중 어떤 페이지를 반환할지 정하고, 반환하는 파일
import React from 'react';
import './IndexNav.css'

const IndexNav = () =>{

    return (
        <div className='indexWrap'>
            <div className='indexMenu'>
                <div className='buttonWrap'>
                    <a href='/service/user/regist'>
                        <img className='indexButton' src='/img/leftButton.png'/>
                    </a>
                </div>
                <div className='buttonWrap right'>
                    <a href='/service/search'>
                        <img className='indexButton' src='/img/rightButton.png'/>
                    </a>
                </div>
            </div>
            <strike>1. 배경을 현재 브라우저 창에 맞게 전체화면으로 indexWrap 조정</strike><br/>
            <strike>2. 창 크기가 일정비율 이하로 줄어들면, 세로 정렬로 변경</strike> --{'>'} 세로 크기를 고정 px이 아닌 비율로 조정<br/>
            3. 이미지 찾기 및 레이아웃 조정<br/>

        </div>
    );
}
export default IndexNav;