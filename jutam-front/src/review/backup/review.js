// 리뷰관련 페이지 중 어떤 페이지를 반환할지 정하고, 반환하는 파일
import './review.css';
import 'bulma/css/bulma.min.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import "moment/locale/ko";

// 심플리뷰 목록( 가게로 구분 )
// 심플리뷰 목록( 계정으로 구분 )
// 심플리뷰 작성

// 상세리뷰 목록( 가게로 구분 )
// 상세리뷰 목록( 계정으로 구분 )
// 상세리뷰 작성


// 1. 기본 HTML구조 정의 : O
// 2. 레코맨드를 스코어로 : O
// 3. 개행문자 치환 : O
///////////////////////////////////////
// 4. 글자수 세로 중앙 맞춤
// 5. 랜더링 및 동작 순서 변경 : 선 테스트 후 적용
// 6. 수정 메커니즘 정정 : 같은값을 받고, 등록시 delete옵션을 통해서 삭제 후 등록 -> update메서드 불필요


function Review() {

    const api = axios.create({
        baseURL : 'http://localhost:8080',
        withCredentials : true,
        credentials: 'include'
    });

    let [user_id, setUser_id] = useState("ReactCSSTester");
    let [place_id, setPlace_id] = useState(123456);
    let [content, setContent] = useState("");
    let [rate, setRate] = useState("");
    const [reviewData, setReviewData] = useState([]);
    let renderWrite = <div>로그인 필요</div>;

    // 리뷰 목록 받기
    function getReviews(){
        api.post('/review/findByPlaceId/'+place_id,{place_id : place_id,})
        .then((Reviews)=>{
            console.log('리뷰 정보 획득 성공');
            console.log(Reviews.data);
            setReviewData(Reviews.data);
        }).catch((Error)=>{
            console.log(Error);
        })
    }

    // onLoad
    useEffect(() =>{
        // 테스트용 기본 세션 주입
        window.sessionStorage.setItem("user_id","ReactCSSTester");
        console.log('확인된 세션 정보 : '+window.sessionStorage.getItem('user_id'));
        getReviews();
    },[]);

    // 세션값 있는지 확인 ( 로그인 여부 확인 )
    if(window.sessionStorage.getItem('user_id')!=null){
        // 로그인 한 유저일 경우
        renderWrite = 
            <div className='writeForm'>
                <form method="post" onSubmit={write}>
                        <div class="star-rating space-x-4 ">
                            <input type="radio" id="5-stars" name="rating" value="5" v-model="ratings" onChange={(e) => {setRate(e.target.value)}} />
                            <label for="5-stars" class="star pr-4">★</label>
                            <input type="radio" id="4-stars" name="rating" value="4" v-model="ratings" onChange={(e) => {setRate(e.target.value)}} />
                            <label for="4-stars" class="star">★</label>
                            <input type="radio" id="3-stars" name="rating" value="3" v-model="ratings" onChange={(e) => {setRate(e.target.value)}} />
                            <label for="3-stars" class="star">★</label>
                            <input type="radio" id="2-stars" name="rating" value="2" v-model="ratings" onChange={(e) => {setRate(e.target.value)}} />
                            <label for="2-stars" class="star">★</label>
                            <input type="radio" id="1-stars" name="rating" value="1" v-model="ratings" onChange={(e) => {setRate(e.target.value)}} />
                            <label for="1-stars" class="star">★</label>
                        </div>
                        <div>
                            <textarea class="textarea is-medium has-fixed-size" name="content"
                            required={true} minLength={5} maxLength={1500} onChange={(e) => {setContent(e.target.value)}}
                            placeholder="내용" value={content}></textarea>
                        </div>
                        <div className='reviewButton'>
                            <span className="showLetter">{content.length} / 1500 &nbsp;</span>
                            <span>    
                                <button type='submit' className="button is-info is-responsive">등록</button>  
                            </span>
                        </div>
                </form>
            </div>;
    }else{
        console.log('확인된 세션 정보 없음 : '+window.sessionStorage.getItem('user_id'));
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

    // 내 리뷰 삭제
    function reviewDelete(e){
        // console.log(e.target.id,window.sessionStorage.getItem('user_id'));
        api.post('/review/delete/'+place_id+'/'+e.target.id,{user_id : window.sessionStorage.getItem('user_id')})
        .then((Reviews)=>{
            console.log('리뷰 삭제 성공');
            getReviews();
        }).catch((Error)=>{
            console.log(Error);
        })
    }

    // 내 리뷰 수정
    function reviewUpdate(e){
        e.preventDefault();
        for(var i = 0 ; i < reviewData.length ; i++){
            if(reviewData[i].review_id == e.target.id){
                setContent(reviewData[i].content);
                setRate(reviewData[i].rate);
                document.getElementById(reviewData[i].rate+'-stars').checked=true;
                reviewDelete(e);
                break;
            }
        }

    }

    // 현재 로그인 계정이 작성자면, 수정 삭제 가능
    function showAction(review){
        if(window.sessionStorage.getItem('user_id') == review.user_id){
            return(
                <span>
                    <a classNmae="reviewUpdate" id={review.review_id} onClick={reviewUpdate}>수정</a> 
                    <span className='pipe'>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                    {/* 수정 누르면 온 클릭값을 update로 수정 */}
                    <a classNmae="reviewDelete" id={review.review_id} onClick={reviewDelete}>삭제</a>
                </span>
            );
        }
    }

    // 받은 리뷰 목록 랜더링
    const renderReviews = reviewData.map(review => {
        let getDate = moment(review.review_date).utc().format('YYYY.MM.DD');
        return (
            // 리뷰id를 유니크키로 삼아서 목록 출력 / 추천여부는 name으로 구분
            <div className="getReview" key={review.review_id}>
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
                    {showAction(review)}
                </div>
            </div>
        );
    });

    // 리뷰 작성
    function write(e,option){
        e.preventDefault();
        if( rate != '' ){ // 추천 비추천 작성 여부
            console.log('리뷰 작성 시도..');
            // if(option == 'delete'){ delete() } // 수정 : 기존 리뷰를 삭제후 등록
            api.post('/review/write',{
                user_id : user_id,
                place_id : place_id,
                content : content.replaceAll("\n","<br/>"),
                rate : rate
            }).then((Response)=>{
                // DB에 입력 성공시 -> 목록 갱신
                if(!Response.data.review_id){
                    console.log('입력 실패');
                }else{
                    console.log('입력 성공');
                    setContent('');
                    setRate(''); 
                    var getRate = document.getElementsByName('rating');
                    for(var i = 0 ; i < getRate.length ; i++){
                        getRate[i].checked = false;
                    }
                    getReviews();
                }

                
            }).catch((Error)=>{
                console.log(Error);
            })
        }else{
            alert("별점을 정해주세요");
            return ;
        }
    }

    function getPlaceReview(){
        api.post('/review/findByPlaceId/'+place_id,).then((Response)=>{
            console.dir(Response.data);
        }).catch((Error)=>{
            console.log(Error);
        })
    }


    function getUserReview(){
        api.post('/review/findByUserId/'+user_id,).then((Response)=>{
            console.dir(Response.data);
        }).catch((Error)=>{
            console.log(Error);
        })
    }

    return (
        
        <div style={{width:'50%'}}>
            현재 장소 ID : 123456 <br/>
            현재 유저 ID : "TestUser" <br/><br/>
            {/* 댓글 작성부 */}
            {renderWrite}
            {/* 현재 장소에 달린 리뷰 목록 */}
            <br/><br/>
            리뷰 목록 ( <b>{reviewData.length}</b> )
            <br/><br/>{renderReviews}
            {/* <div className='showReview'>
                
            </div> */}
            
            {/* <br/><button type="button" onClick={getPlaceReview}>장소 : {place_id} 댓글 목록 받기</button>
            <br/><button type="button" onClick={getUserReview}>유저 : {user_id} 댓글 목록 받기</button> */}
            <br/><input hidden type="text" name="place_id" value={place_id}/>
            <br/><input hidden type="text" name="user_id" value={user_id}/>
        </div>
    );
}

export default Review;


