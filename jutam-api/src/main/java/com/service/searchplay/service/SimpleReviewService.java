package com.service.searchplay.service;

import com.service.searchplay.model.review.SimpleReview;
import com.service.searchplay.repository.review.SimpleReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class SimpleReviewService {

    private final SimpleReviewRepository simpleReviewRepository;
    // 단순한 빈을 담기위한 객체 껍데기

    @Autowired
    // 빈으로 생성된 레포지토리 객체를 받기위한 생성자 -> 껍데기에 레포지토리 빈이 오토와이어드로 인해 들어감
    public SimpleReviewService(SimpleReviewRepository simpleReviewRepository) {this.simpleReviewRepository = simpleReviewRepository;}


    public boolean write(SimpleReview review) {
        System.out.println("[Service] 작성 시도..");
        return simpleReviewRepository.write(review);
    }
    
    public boolean delete(int place_id, int review_id, String user_id){
        int res = simpleReviewRepository.delete(place_id, review_id, user_id);
        System.out.println(" -> [Service] 유저 "+user_id+" 의 한줄 리뷰 삭제 요청 결과 : " + res);
        if(res  > 0) return true;
        else return false;
    }

    public List<SimpleReview> findByPlaceId(int place_id){
        return simpleReviewRepository.findByPlaceId(place_id);
    }

    public boolean update(SimpleReview review){
        int res = simpleReviewRepository.update(review);
        System.out.println(" -> [Service] 유저 "+review.getUser_id()+"의 한줄리뷰 수정 값 : "+res);
        if(res>0) return true;
        else return false;
    }

    public List<SimpleReview> findByUserId(String user_id){
        return simpleReviewRepository.findByUserId(user_id);
    }

}
