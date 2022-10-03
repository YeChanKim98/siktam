import './style/MyReview.css';
import 'bulma/css/bulma.min.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import "moment/locale/ko";
import GetReviewData from './GetReview';
import UpdateReviewModal from './UpdateReviewModal';



function Review() {
    const api = axios.create({
        baseURL : 'http://localhost:8080/api',
        withCredentials : true,
        credentials: 'include'
    });

    let [user_id, setUser_id] = useState(window.sessionStorage.getItem('user_id'));
    let [place_id, setPlace_id] = useState(123456);
    let [content, setContent] = useState("");
    let [rate, setRate] = useState("");
    const [reviewData, setReviewData] = useState([]);
    let [reviewObj, setReviewObj] = useState({});
    let renderWrite = <div>로그인 필요</div>;

    const [modalOpen, setModalOpen] = useState(false);
    const openModal = () => {
        setModalOpen(true);
    };
    const closeModal = () => {
        setModalOpen(false);
    };

    // onLoad
    useEffect(() =>{
        GetReviewData(user_id).then((result) => {setReviewData(result);}); // 컴포넌트 분리
    },[]);
    
    //리뷰목록의 별을 반환
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

    // 내 리뷰 삭제
    function reviewDelete(e){
        api.post('/review/delete/'+place_id+'/'+e.target.id,{user_id : window.sessionStorage.getItem('user_id')})
        .then((Reviews)=>{
            console.log('리뷰 삭제 성공');
            GetReviewData(user_id).then((result) => {setReviewData(result);});
        }).catch((Error)=>{
            console.log(Error);
        })
    }
    
    // 받은 리뷰 목록 랜더링
    const renderReviews = reviewData.map(review => {
        
        let getDate = moment(review.review_date).utc().format('YYYY.MM.DD');
        return (
            // 리뷰id를 유니크키로 삼아서 목록 출력 / 추천여부는 name으로 구분
            <div className='getReview' key={review.review_id}>
                <div className='reviewPlace'>리뷰 장소 정보</div>
                <div className='myReview'>
                    <div>
                        {getStar(review.rate)}
                    </div>
                    <div className='reviewContent'>{review.content.replaceAll("<br/>","\n")}</div>
                    <div className='reviewDate'>{getDate}</div>
                </div>
                <div className='reviewAction'>
                    <span> 
                        <a className='reviewUpdate' id={review.review_id} onClick={()=>{setReviewObj(review);openModal();}}>수정</a> 
                        <span className='pipe'>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                        {/* 수정 누르면 온 클릭값을 update로 수정 */}
                        <a className='reviewDelete' id={review.review_id} onClick={reviewDelete}>삭제</a>
                    </span>
                </div>
            </div>
        );
    });

    

    return (
        
        <div>
            <UpdateReviewModal open={modalOpen} close={closeModal} review={reviewObj} header="리뷰 수정" ></UpdateReviewModal>
            내 상세 리뷰 : <b>{reviewData.length}개</b>
            <br/><br/>{renderReviews}
            {/* <br/><input hidden type="text" name="place_id" value={place_id}/>
            <br/><input hidden type="text" name="user_id" value={user_id}/> */}
            1. 이스케이핑 br 태그를 실제 태그로 전환 할 것
        </div>
    );
}

export default Review;


