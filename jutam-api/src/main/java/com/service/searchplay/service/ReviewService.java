package com.service.searchplay.service;

import com.service.searchplay.model.review.Review;
import com.service.searchplay.model.review.SimpleReview;
import com.service.searchplay.repository.review.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ReviewService {

    private final ReviewRepository reviewRepository;

    @Autowired
    // 빈으로 생성된 레포지토리 객체를 받기위한 생성자 -> 껍데기에 레포지토리 빈이 오토와이어드로 인해 들어감
    public ReviewService( ReviewRepository reviewRepository ) { this.reviewRepository = reviewRepository; }

    public boolean write(Review review) {
        System.out.println("[Service] 상세 작성 시도");
        return reviewRepository.write(review);
    }
    
    public boolean delete(int place_id, int review_id, String user_id){
        int res = reviewRepository.delete(place_id, review_id, user_id);
        System.out.println("[Service] "+user_id+"의 상세 리뷰 삭제 결과 : "+res);
        if(res > 0) return true;
        else return false;
    }

    public List<Review> findByPlaceId(int place_id){
        return reviewRepository.findByPlaceId(place_id);
    }

    public boolean update(Review review){
        int res = reviewRepository.update(review);
        System.out.println(" -> [Service] 유저 "+review.getUser_id()+"의 상세 리뷰 수정 결과 : "+res);
        if(res > 0) return true;
        else return false;
    }


    public List<Review> findByUserId(String user_id){
        return reviewRepository.findByUserId(user_id);
    }

}
