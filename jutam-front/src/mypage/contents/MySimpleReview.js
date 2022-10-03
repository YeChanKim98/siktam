
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import 'bulma/css/bulma.min.css';
import './style/MySimpleReview.css';
import "moment/locale/ko"; // 한국 시간대로(09시간 차), 위 코드와 합칠 수 없다
import UpdateSimpleReviewModal from './UpdateSimpleReviewModal';

function MySimpleReview(){

    const api = axios.create({
        baseURL : 'http://localhost:8080/api',
        withCredentials : true
    });

    const [user_id, setUser_id] = useState(window.sessionStorage.getItem("user_id"));
    let [reviewData, setReviewData] = useState([]);
    let [reviewObj, setReviewObj] = useState({});


    const {DELETE_SUCCESS, DELETE_FAIL} = ['DELETE_SUCCESS','DELETE_FAIL'];

    // 모달용 변수
    const [modalOpen, setModalOpen] = useState(false);
    const openModal = () => {
        setModalOpen(true);
    };
    const closeModal = () => {
        setModalOpen(false);
    };

    // onLoad
    useEffect(() =>{
        getReviews();
    },[]);

    // 리뷰 목록 받기
    function getReviews(){
        api.post('/review/simple/findByUserId/'+user_id,)
        .then((Reviews)=>{
            console.log('리뷰 정보 획득 성공..!');
            setReviewData(Reviews.data);
        }).catch((Error)=>{
            console.log(Error);
        })
    }

    // 받은 리뷰 목록 랜더링
    const renderReviews = reviewData.map(review => {
        // let getDate = moment(review.review_date).format('YYYY-MM-DD a HH:mm');
        let getDate = moment(review.review_date).utc().format('lll'); // 위와 같은 코드
        return (
            // 테이블 테그 안에 넣어서 항복별 칼럼이름 표시
            <div className="simpleReview" id={review.place_id} key={review.review_id}>
                <div className='reviewPlace'>가게정보</div>
                <div className={"simpleReviewContent_"+review.recmnd}>{review.content}</div>
                <div className="simpleReviewDate">{getDate}</div>
                <div className="simpleReviewAction"> 
                        <a className='reviewUpdate' id={review.review_id} onClick={()=>{setReviewObj(review);openModal();}}>수정</a> 
                        <span className='pipe'>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                        <a className='reviewDelete' id={review.review_id} onClick={reviewDelete}>삭제</a>
                </div>
            </div> 
        );
    });

    // 내 리뷰 삭제
    function reviewDelete(e){
        api.post('/review/simple/delete/'+user_id,{
            place_id : e.target.parentNode.parentNode.id,
            review_id : e.target.id})
        .then((Result)=>{
            const resCode = Result.data;
            if(resCode == DELETE_SUCCESS){
                getReviews(user_id).then((result) => {setReviewData(result);});
            }else if(resCode == DELETE_FAIL){
                alert('리뷰 삭제실패.');
            }
        }).catch((Error)=>{
            console.log(Error);
        })
    }

    return(
        <>
            {/* 리뷰정보 : 페이지 네이션 추가<br/>
            1. 모든 리뷰 정보를 넘기고, 페이지 변수를 통해서 슬라이스하여 보여준다 : 리뷰정보가 많아지면 부담됨<br/>
            2. 총 갯수와 시작범위, 1페이지에 해당하는 정보만 넘기고, 페이지를 넘길 때마다 API에 요청한다 : 1안에 비해 동작이 많음<br/>
            3. 로컬 스토리지 : 이게있었네 ㅎ<br/> */}
            <div>
                <UpdateSimpleReviewModal open={modalOpen} close={closeModal} review={reviewObj} header="리뷰 수정" ></UpdateSimpleReviewModal>
                {renderReviews}
            </div>
        </>
    );
}

export default MySimpleReview;


