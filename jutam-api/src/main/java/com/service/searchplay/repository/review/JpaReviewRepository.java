package com.service.searchplay.repository.review;

import com.service.searchplay.model.review.Review;
import org.springframework.stereotype.Repository;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Repository
public class JpaReviewRepository implements ReviewRepository{

    @PersistenceContext
    private final EntityManager em;
    public JpaReviewRepository(EntityManager em) {
        this.em = em;
    }

    // 리뷰 작성
    @Override
    public boolean write(Review review) {
        try {
            em.persist(review);
            System.out.println("[Repository] 작성 완료");
            return true;
        }catch(Exception e){
            System.out.println(" -> [Repository] 상세 리뷰 작성 실패 : "+e);
            return false;
        }
    }

    // 리뷰 삭제
    @Override
    public int delete(int place_id, int review_id, String user_id) {
        int res = em.createQuery("delete from Review r where r.place_id=:place_id and r.review_id=:review_id and r.user_id=:user_id ")
                .setParameter("place_id",place_id)
                .setParameter("review_id",review_id)
                .setParameter("user_id",user_id)
                .executeUpdate();
        System.out.println(" -> [Repository] 삭제 요청 결과 : "+res);
        return res;
    }

    // 현재 장소에 달린 리뷰 찾기
    @Override
    public List<Review> findByPlaceId(int place_id) {
        return em.createQuery("select r from Review r where r.place_id=:place_id", Review.class)
                .setParameter("place_id",place_id)
                .getResultList();
    }

    // 리뷰 정정
    @Override
    public int update(Review review) {
        // UPDATE (테이블) SET (칼럼) = '변경할값' WHERE (조건)
        System.out.println(" -> [Repository] 상세 리뷰 수정 실시");
        int res =  em.createQuery("update Review r set r.content=:content, r.content=:content, r.review_date=current_timestamp where r.place_id=:place_id and r.user_id=:user_id")
                .setParameter("content",review.getContent())
                .setParameter("content",review.getContent())
                .setParameter("place_id",review.getPlace_id())
                .setParameter("user_id",review.getUser_id())
                .executeUpdate();
        if(res > 0) return res;
        else{
            System.out.println(" -> [Repository] 업데이트 요청 실패");
            return 0;
        }
    }

    // 특정 사용자가 작성한 리뷰 찾기
    @Override
    public List<Review> findByUserId(String user_id) {
        return em.createQuery("select r from Review r where r.user_id=:user_id", Review.class)
                .setParameter("user_id",user_id)
                .getResultList();
    }

    // 리뷰id 재정렬
    @Override
    public void rearrangement() { }
}
