package com.service.searchplay.controller;

import com.service.searchplay.configuration.ResultCode;
import com.service.searchplay.model.review.Review;
import com.service.searchplay.model.review.SimpleReview;
import com.service.searchplay.service.ReviewService;
import com.service.searchplay.service.SimpleReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;

// 1. 반환값을 Enum으로 정의해서 상수를 반환하도록 수정
// 2. 공통적인 로직은 분리(AOP)
// 3.

@RestController // 다른 서버랑 정보를 Json형태로 주고 받기위한 어노테이션
@CrossOrigin(origins = {"http://localhost:3000"} , allowedHeaders = "*", allowCredentials = "true")
// CORS : 다른 호스트와 정보를 서로 주고받기위한 정책
@RequestMapping(value = "api/review", method = {RequestMethod.GET, RequestMethod.POST})
public class ReviewController {

    private final SimpleReviewService simpleReviewService;
    private final ReviewService reviewService;

    @Autowired
    public ReviewController(SimpleReviewService simpleReviewService, ReviewService reviewService) {
        this.reviewService = reviewService;
        this.simpleReviewService = simpleReviewService;
    }

    // 작성 : 세션을 확인 후 본인이 맞으면 작성 후 코드 반환
    @PostMapping("/simple/write")
    public String simpleWrite(@RequestBody SimpleReview review, HttpSession session){
        System.out.println("\n[Controller] 한줄 리뷰 작성 요청 : [ "+review.getContent()+" / "+review.getRecmnd()+" / "+review.getUser_id()+" / "+review.getPlace_id()+" ]");
        String user_id = session.getAttribute("user_id").toString(); // 세션에서 ID받아오기
        review.setUser_id(user_id); // 프론트에서 값을 조정하더라도 톰캣의 세션에서 ID를 받아옴
        if(simpleReviewService.write(review)){
            System.out.println(" -> [Controller] 작성 성공");
            return "WRITE_SUCCESS";
        }else{
            return ResultCode.WRITE_SUCCESS.toString();
//            return "WRITE_FAIL";
        }
    }

    // 심플 삭제 : 현재 접속한 id와 리뷰넘버가 같으면 삭제 실행
    @PostMapping("/simple/delete/{user_id}")
    public String simpleDelete(@PathVariable String user_id, @RequestBody SimpleReview review, HttpSession session){ // 세션 아이디 획득
        if(certified(user_id, session)) {
            // user_id가 필요한지 확인 후 정정
            int place_id = review.getPlace_id();
            int review_id = review.getReview_id();
            System.out.println("[Controller] 유저 "+user_id+" 의 한줄 리뷰 삭제 요청 ( Place_id : "+place_id+" / Review_id : "+review_id);
            if(simpleReviewService.delete(place_id, review_id, user_id)){ return "DELETE_SUCCESS"; } // 작성 성공
            else{ return "DELETE_FAIL"; } // 작성 실패
        }else{
            return "CERTIFIED_FAIL"; // 본인이 아닐 시
        }
    }
    
    // 심플 수정 : 세션값과 id가 일치하면 수정
    @PostMapping("/simple/update")
    public String simpleUpdate(@RequestBody SimpleReview review, HttpSession session){
        // 리뷰안에 내용 있는지 확이
        if(!certified(review.getUser_id(),session)){ return "CERTIFIED_FAIL"; }
        System.out.println("[Controller] 유저 "+review.getUser_id()+"의 한줄리뷰 수정 요청 ("+review.getReview_id()+" / "+review.getRecmnd()+" / "+review.getContent()+" ) ");
        if(simpleReviewService.update(review)){ return "SIMPLE_REVIEW_UPDATE_SUCCESS"; }
        else{ return "SIMPLE_REVIEW_UPDATE_FAIL"; }
    }

    // 장소ID로 검색
    @PostMapping("/simple/findByPlaceId/{place_id}")
    public List<SimpleReview> simpleFindByPlaceId(@PathVariable int place_id){
        List<SimpleReview> placeReviews = simpleReviewService.findByPlaceId(place_id);
        return placeReviews;
    }

    // 유저ID로 검색 : 세션값을 확인하여, 본인이 아니면 확인 불가
    @PostMapping( "/simple/findByUserId/{user_id}")
    public List<SimpleReview> simpleFindByUserId(@PathVariable String user_id, HttpSession session){
        List<SimpleReview> userReviews = null;
        System.out.println("[Controller] 유저"+user_id+"의 한줄 리뷰 목록 요청");
        if(certified(user_id,session)){ userReviews = simpleReviewService.findByUserId(user_id); }
        else{ System.out.println(" -> [Controller] 본인 확인 실패"); }
        return userReviews; //
    }

    /////////////////////////////////////////////////////[상세리뷰]/////////////////////////////////////////////////////////

    // 상세 작성
    @PostMapping("/write")
    public String write(@RequestBody Review review, HttpSession session){
        System.out.println("\n[Controller] 한줄 리뷰 작성 요청 : [ "+review.getContent()+" / "+review.getUser_id()+" / "+review.getPlace_id()+" ]");
        String user_id = session.getAttribute("user_id").toString(); // 세션에서 ID받아오기
        review.setUser_id(user_id); // 프론트에서 값을 조정하더라도 톰캣의 세션에서 ID를 받아옴
        if(reviewService.write(review)){
            System.out.println(" -> [Controller] 작성 성공");
            return "WRITE_SUCCESS";
        }else{
            return "WRITE_FAIL";
        }
    }

    // 삭제 : 현재 접속한 id와 리뷰넘버가 같으면 삭제 실행
    @PostMapping("/delete/{place_id}/{review_id}")
    public String delete(@PathVariable int place_id, @PathVariable int review_id, @RequestBody HashMap<String, String> user_id, HttpSession session){ // 세션 아이디 획득
        System.out.println("[Controller] 리뷰 삭제 요청 :"+place_id+" / "+review_id+" / "+user_id.get("user_id"));
        if(certified(user_id.get("user_id"),session)){
            if(reviewService.delete(place_id, review_id, user_id.get("user_id"))){return "DELETE_SUCCESS";}
            else{return "DELETE_FAIL";}
        }else{return "CERTIFIED_FAIL";}
    }
    
    // 상세 수정
    @PostMapping("/update")
    public String update(@RequestBody Review review, HttpSession session){
        if(!certified(review.getUser_id(),session)){ return "CERTIFIED_FAIL"; }
        if(reviewService.update(review)){ return "REVIEW_UPDATE_SUCCESS"; }
        else{return "REVIEW_UPDATE_FAIL";}
    }

    // 장소ID로 검색
    @PostMapping("/findByPlaceId/{place_id}")
    public List<Review> findByPlaceId(@PathVariable int place_id){
        List<Review> placeReviews = reviewService.findByPlaceId(place_id);
        return placeReviews;
    }

    // 유저ID로 검색
    @PostMapping( "/findByUserId/{user_id}")
    public List<Review> findByUserId(@PathVariable String user_id, HttpSession session){
        List<Review> userReviews = null;
        System.out.println("[Controller] 유저"+user_id+"의 상세 리뷰 목록 요청");
        if(certified(user_id,session)){ userReviews = reviewService.findByUserId(user_id); }
        else{ System.out.println(" -> [Controller] 본인 확인 실패"); }
        return userReviews;
    }

    //////////////////////////////////////////////////////////////////////[공용 메서드]]/////////////////////////////////////////////////////////////////////////

    public boolean certified(String user_id, HttpSession session){
        return true; // 부분 테스트 이므로, 세션 주입과정(로그인API) 생략으로 인해 임시로 True반환/
//        if(user_id == session.getAttribute("user_id")) return true;
//        else return false;
    }

}
