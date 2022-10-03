import { render } from '@testing-library/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './style/UpdateSimpleReviewModal.css';

const UpdateSimpleReviewModal = (props) => {
    
    const { open, close, review, header} = props;
    const login_id = window.sessionStorage.getItem('user_id');

    // 업데이트 결과 상수
    const SIMPLE_REVIEW_UPDATE_SUCCESS = 'SIMPLE_REVIEW_UPDATE_SUCCESS', SIMPLE_REVIEW_UPDATE_FAIL  = 'SIMPLE_REVIEW_UPDATE_FAIL';

    // 수정 값
    let [updateContent, setUpdateContent] = useState(review.content);
    let [updateRecmnd, setUpdateRecmnd] = useState('Good');

    // 초기 랜더링 시 널값으로 인한 에러 방지
    if (!open){return(<></>);}
    else if(updateContent==null){
        setUpdateContent(review.content);
    }

    // 엑시오스 객체
    const api = axios.create({
        baseURL : 'http://localhost:8080/api',
        withCredentials : true
    });

    // 수정
    // 세션 스토리지 아이디,  선택 정보, 콘텐츠정보
    function requestUpdateSimpleReview(){
        const contentInput = document.getElementById('updateContent');
        console.log(contentInput.value.length);
        if(contentInput.value.length < 2){
            alert('2자 이상 입력해야합니다.');
            contentInput.focus();
            return 0;
        }
        console.log('[ ',review.place_id,' / ',review.review_id,' ] -> ',login_id,' : ','[ ',updateRecmnd,' ] ',updateContent);
        api.post('/review/simple/update/'+review.place_id+'/'+review.review_id,{
            user_id : login_id, 
            review_id : review.review_id,
            recmnd : updateRecmnd,
            content : updateContent 
        }).then((Result)=>{
            var resCode = Result.data;
            if(resCode == SIMPLE_REVIEW_UPDATE_SUCCESS){
                window.location.reload();
            }else if(resCode == SIMPLE_REVIEW_UPDATE_FAIL){
                alert('리뷰 수정에 실패했습니다.')
            }else{
                // 기타 실패시 백엔드 반환 코드
                alert('Error : ',resCode);
            }
        }).catch((Error)=>{ 
            console.log('Error : ',Error);
        })
    }

    return (
    <div className='openModal simpleReviewUpdateModal'>
    {/* <div className={open ? 'openModal simpleReviewUpdateModal' : 'simpleReviewUpdateModal'}> */}
        {/* {open ? ( */}
        <section>
            <header>
                {header}
                <button className="close" onClick={close}>&times;</button>
            </header>
            <main>

                <form className='updateForm'>
                    <div className='reviewPlaceInfo'>
                        <div className='placeIdLabel'>장소 정보</div>
                        <div className='placeId'><input type="text" className="input" value={review.place_id} disabled/></div>
                    </div>
                    <div className='updateInfo'>
                        <div className='select is-primary'>
                            {/* select 값에 따른 테두리 색상 변경 및 기존값은 셀렉티드로 반영 */}
                            <select onChange={(e)=>{setUpdateRecmnd(e.target.value);}}>
                                <option value='Good'>Good</option>
                                <option value='Bad'>Bad</option>
                            </select>
                        </div>
                        <div className='updateContent'>
                            {/* useState를 사용 못하므로 다른 방법 사용 */}
                            <input type="text" id='updateContent' className="input is-primary" required minLength={2} maxLength={55} 
                                onChange={(e)=>{setUpdateContent(e.target.value);}}
                                onKeyPress={(e)=>{if(e.key=='Enter'){requestUpdateSimpleReview();}}}
                                value={updateContent}/>
                        </div>
                    </div>
                </form>
            </main>
            <footer>
            <div>
                <button type="button" class="simpleUpdateSubmit button is-primary" onClick={requestUpdateSimpleReview}>수정</button>
            </div>
            </footer> 
        </section>
        {/* ) : null} */}
    </div>
    );
};

export default UpdateSimpleReviewModal;
