import { render } from '@testing-library/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './style/UpdateReviewModal.css';

const UpdateReviewModal = (props) => {
    
    const { open, close, review, header} = props;
    const login_id = window.sessionStorage.getItem('user_id');

    // 업데이트 결과 상수
    const REVIEW_UPDATE_SUCCESS = 'REVIEW_UPDATE_SUCCESS', REVIEW_UPDATE_FAIL  = 'REVIEW_UPDATE_FAIL';

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
            if(resCode == REVIEW_UPDATE_SUCCESS){
                window.location.reload();
            }else if(resCode == REVIEW_UPDATE_FAIL){
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
                
                <div className='reviewUpdateForm'>
                    <form method="post" onSubmit={null}>
                            <div class="star-rating">
                                <input type="radio" id="5-stars" name="rating" value="5" v-model="ratings"  />
                                <label for="5-stars" class="star pr-4">★</label>
                                <input type="radio" id="4-stars" name="rating" value="4" v-model="ratings"  />
                                <label for="4-stars" class="star">★</label>
                                <input type="radio" id="3-stars" name="rating" value="3" v-model="ratings"  />
                                <label for="3-stars" class="star">★</label>
                                <input type="radio" id="2-stars" name="rating" value="2" v-model="ratings"  />
                                <label for="2-stars" class="star">★</label>
                                <input type="radio" id="1-stars" name="rating" value="1" v-model="ratings" /> {/*onChange={(e) => {setRate(e.target.value)}}*/} 
                                <label for="1-stars" class="star">★</label>
                            </div>
                            <div>
                                <textarea class="textarea is-medium has-fixed-size" name="content"
                                required={true} minLength={5} maxLength={1500}
                                placeholder="내용" value={null}></textarea>
                            </div>
                            <div className='reviewButton'>
                                <span className="showLetter">{null} / 1500 &nbsp;</span>
                                <span>    
                                    <button type='submit' className="button is-info is-responsive">등록</button>  
                                </span>
                            </div>
                    </form>
                </div>

            </main>
            <footer>
            <div>
                <button type="button" class="simpleUpdateSubmit button is-primary" onClick={null}>수정</button>
            </div>
            </footer> 
        </section>
        {/* ) : null} */}
    </div>
    );
};

export default UpdateReviewModal;
