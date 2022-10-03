package com.service.searchplay.repository.review;

import com.service.searchplay.model.review.SimpleReview;
import java.util.List;

// 리뷰작성, 삭제, 장소 오버레이 기본 출력 리뷰, 리뷰 수정, 내 리뷰 찾기
public interface SimpleReviewRepository {
    Boolean write(SimpleReview review); // 실행 결과 반환

    // place_id는 현재 오버레이에서, user_id는 현재 세션에서 받아옴
    int delete(int place_id, int review_id, String user_id); // 실행 결과 반환

    // 특정 장소에 달린 리뷰를 한번에 받아옴
    List<SimpleReview> findByPlaceId(int place_id);

    // 리뷰 수정
    int update(SimpleReview review); // 실행 결과 반환

    // 특정 유저가 작성한 리뷰를 한번에 받아옴
    List<SimpleReview> findByUserId(String user_id);

    void rearrangement();

}
