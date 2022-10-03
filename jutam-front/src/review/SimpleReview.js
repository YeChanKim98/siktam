import './simpleReview.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {Cookies} from "react-cookie";
import moment from 'moment';
import 'bulma/css/bulma.min.css';
import "moment/locale/ko"; // 한국 시간대로(09시간 차), 위 코드와 합칠 수 없다
//CSS로 인한 이름 변경 : review -> +simple
function SimpleReview() {
    const cookies = new Cookies();

    const api = axios.create({
        baseURL : 'http://localhost:8080',
        withCredentials : true
    });

    let [user_id, setUser_id] = useState("ReactCSSTester");
    let [place_id, setPlace_id] = useState(123456);
    let [content, setContent] = useState("");
    let [recmnd, setRecmnd] = useState("");
    const [reviewData, setReviewData] = useState([]);
    let renderWrite = <div>로그인 필요</div>;
    let renderRecmnd;

    // 리뷰 목록 받기
    function getReviews(){
        api.post('/review/simple/findByPlaceId/'+place_id,{place_id : place_id,})
        .then((Reviews)=>{
            console.log('리뷰 정보 획득 성공..!');
            setReviewData(Reviews.data);
        }).catch((Error)=>{
            console.log(Error);
        })
    }

    // onLoad
    useEffect(() =>{
        // 테스트용 기본 세션 주입
        window.sessionStorage.setItem("user_id","TestUser");
        console.log('테스트용 세션 정보 생성 : ',window.sessionStorage.getItem("user_id"));
        getReviews();
    },[]);

    // 세션값 있는지 확인 ( 로그인 여부 확인 )
    if(window.sessionStorage.getItem('user_id')!=null){
        console.log('확인된 세션 정보 : '+window.sessionStorage.getItem('user_id'));
        // 로그인 한 유저일 경우
        renderWrite = 
            <div className='writeSimpleForm'>
                <form method="post" onSubmit={write}>
                    
                        <input type="text" name="content" class="input is-primary" style={{width:'80%', display:'inline' }}
                        required={true} minLength={2} maxLength={55} 
                        onChange={(e) => {setContent(e.target.value)}} value={content}>
                        </input>
                    
                    <button type="submit" class="button is-primary">작성</button>
                    
                    <br/><input hidden type="text" name="place_id" value={place_id}/>
                    <br/><input hidden type="text" name="user_id" value={user_id}/>
                </form>
            </div>;
    }else{
        console.log('확인된 세션 정보 없음 : '+window.sessionStorage.getItem('user_id'));
    }

    // 받은 리뷰 목록 랜더링
    const renderReviews = reviewData.map(review => {
        // let getDate = moment(review.review_date).format('YYYY-MM-DD a HH:mm');
        let getDate = moment(review.review_date).utc().format('lll'); // 위와 같은 코드
        return (
            // 리뷰id를 유니크키로 삼아서 목록 출력 / 추천여부는 name으로 구분
            <div className="simpleReview" key={review.review_id}>
                <div className="simpleReviewUser">{review.user_id}</div>
                <div className={"simpleReviewContent_"+review.recmnd}>{review.content}</div>
                <div className="simpleReviewDate">{getDate}</div>
            </div>
        );
    });

    // 리뷰 작성
    function write(e){
        e.preventDefault();
        if( recmnd != '' ){ // 추천 비추천 작성 여부
            console.log('리뷰 작성 시도..');
            api.post('/review/simple/write',{
                user_id : user_id,
                place_id : place_id,
                content : content,
                recmnd : recmnd
            }).then((Response)=>{
                console.log(Response.data);
                // DB에 입력 성공시 -> 목록 갱신
                if(!Response.data.review_id){
                    console.log('입력 실패');
                }else{
                    console.log('입력 성공');
                    setContent('');
                    setRecmnd(''); 

                    // 체크 해제
                    var radio = document.getElementsByName("recmnd");
                    radio[0].checked=false;
                    radio[1].checked=false;
                    getReviews();
                }
                // 쿠키 및 세션 테스트
                // cookies.set('user_id',Response.data.user_id,{path:'/',expire,});
                // console.log('Success SetKookies : ',cookies.get('user_id'));
                // console.log(Response.data);
            }).catch((Error)=>{
                console.log(Error);
            })
        }else{
            alert("추천, 비추천 여부를 정해주세요");
            console.log("추천, 비추천 여부를 정해주세요");
            return ;
        }
    }

    return (
        <div>
            리뷰정보
            {/* 현재 장소에 달린 리뷰 목록 */}
            <div className='showSimpleReview'>
                <label class="recmndGood" id="recmndLabel">
                    <input type="radio" name="recmnd" onChange={(e) => {setRecmnd("Good")}} value="Good" />
                    <img id='recmndImg' name="goodImg" src="img/ThumbsUp.png"></img>
                </label>

                <label id="recmndLabel">
                    <input type="radio" name="recmnd" onChange={(e) => {setRecmnd("Bad")}} value="Bad"/>
                    <img id='recmndImg' name="BadImg" src="img/ThumbsDown.png"></img>
                </label>

                {renderReviews}
            </div>
            {/* 댓글 작성부 */}
            {renderWrite}
        </div>
    );
}

// 1. 로그인 세션이 있으면 입력창 활성화 : O
// 2. 문자입력 여부 확인 : O
// 3. 추천/비추천 결정 여부 : O
// 4. 입력 폼 CSS -> 누른 추천,비추천 여부에 따라 input 테두리 색상 변경(Bulma사용)

export default SimpleReview;


