package com.service.searchplay.configuration;

import com.service.searchplay.repository.place.JpaPlaceRepository;
import com.service.searchplay.repository.place.PlaceRepository;
import com.service.searchplay.repository.recommend.JpaRecommendRepository;
import com.service.searchplay.repository.recommend.RecommendRepository;
import com.service.searchplay.repository.reserve.JpaReserveRepository;
import com.service.searchplay.repository.reserve.ReserveRepository;
import com.service.searchplay.repository.review.JpaReviewRepository;
import com.service.searchplay.repository.review.JpaSimpleReviewRepository;
import com.service.searchplay.repository.review.ReviewRepository;
import com.service.searchplay.repository.review.SimpleReviewRepository;
import com.service.searchplay.repository.user.JpaUserRepository;
import com.service.searchplay.repository.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Configuration
public class SpringConfig {

    @PersistenceContext
    private EntityManager em;

    @Autowired
    public SpringConfig(EntityManager em) { this.em = em; }

    // 유저 빈
    @Bean
    public UserRepository userRepository(){
        return new JpaUserRepository(em);
    }

    // 심플리뷰 빈
    @Bean
    public SimpleReviewRepository simpleReviewRepository() { return new JpaSimpleReviewRepository(em); }

    // 상세리뷰 빈
    @Bean
    public ReviewRepository reviewRepository() { return new JpaReviewRepository(em); }

    // 예약 빈
    @Bean
    public ReserveRepository reserveRepository(){
        return new JpaReserveRepository(em);
    }

    // 장소 추천 빈
    @Bean
    public RecommendRepository recommendRepository() { return new JpaRecommendRepository(em); }

    // 장소 검색 빈
    @Bean
    public PlaceRepository placeRepository() { return new JpaPlaceRepository(em); }

}
