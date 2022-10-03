// 리뷰관련 페이지 중 어떤 페이지를 반환할지 정하고, 반환하는 파일
import './GetReview.css';
import 'bulma/css/bulma.min.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import "moment/locale/ko";

// 내가 쓴 리뷰 목록 조회


function GetReview() {

    window.sessionStorage.setItem("user_id","ReactCSSTester"); // 테스트용 세션 주입
    let user_id = window.sessionStorage.getItem('user_id')

    const api = axios.create({
        baseURL : 'http://localhost:8080',
        withCredentials : true,
        credentials: 'include'
    });
    let [place_id, setPlace_id] = useState(123456);
    let [content, setContent] = useState("");
    let [rate, setRate] = useState("");
    const [reviewData, setReviewData] = useState([]);
    let renderWrite = <div>로그인 필요</div>;

    // 유저의 리뷰 목록 받기
    function getReviews(){
        api.post('/review/findByUserId/'+user_id)
        .then((Reviews)=>{
            console.log(Reviews.data);
            setReviewData(Reviews.data);
        }).catch((Error)=>{
            console.log(Error);
        })
    }

    // onLoad
    useEffect(() =>{
        getReviews();
    },[]);


    // 내 리뷰 삭제
    function reviewDelete(e){
        api.post('/review/delete/'+place_id+'/'+e.target.id,{user_id : window.sessionStorage.getItem('user_id')})
        .then((Reviews)=>{
            console.log('리뷰 삭제 성공');
            getReviews();
        }).catch((Error)=>{
            console.log(Error);
        })
    }


    // 리뷰목록의 별을 반환
    function getStar(operand){
        return(
            <span>
                <span className="fillStar">
                    {'★'.repeat(operand)}
                </span>
                <span className="emptyStar">
                    {'★'.repeat(5-operand)}
                </span>
                &nbsp;({operand})
            </span>
        );
    }

    // 받은 리뷰 목록 랜더링
    const renderReviews = reviewData.map(review => {
        let getDate = moment(review.review_date).utc().format('YYYY.MM.DD');
        return (
            // 리뷰id를 유니크키로 삼아서 목록 출력 / 추천여부는 name으로 구분
            <div className="getReview" key={review.review_id}>
                <div className="place">
                    장소정보
                </div>
                <div className="reviewData">
                    <div className="reviewUser">{review.user_id}
                        <span className='pipe'>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                        {getStar(review.rate)}
                    </div>
                    <div className={"reviewContent"}>{review.content.replaceAll("<br/>","\n")}</div>
                    <div className="reviewActionList">
                        <span>
                            {getDate}
                            <span className='pipe'>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                        </span>
                        <a classNmae="reviewDelete" id={review.review_id} onClick={reviewDelete}>삭제</a>
                    </div>
                </div>
            </div>
        );
    });

    return (
        <div style={{width:'50%'}}>
            {renderReviews}
        </div>
    );
}

export default GetReview;


// 현재 장소 ID : 123456 <br/>
// 현재 유저 ID : "TestUser" <br/><br/>
// {/* 댓글 작성부 */}
// {renderWrite}
// {/* 현재 장소에 달린 리뷰 목록 */}
// <br/><br/>
// 리뷰 목록 ( <b>{reviewData.length}</b> )
// <br/><br/>{renderReviews}
// {/* <div className='showReview'>
    
// </div> */}

// {/* <br/><button type="button" onClick={getPlaceReview}>장소 : {place_id} 댓글 목록 받기</button>
// <br/><button type="button" onClick={getUserReview}>유저 : {user_id} 댓글 목록 받기</button> */}
// <br/><input hidden type="text" name="place_id" value={place_id}/>
// <br/><input hidden type="text" name="user_id" value={user_id}/>