package com.service.searchplay.service;

import com.service.searchplay.model.recommend.Recommend_Plcae;
import com.service.searchplay.model.resv.Reserve;
import com.service.searchplay.repository.recommend.RecommendRepository;
import com.service.searchplay.repository.reserve.ReserveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class RecommendService {

    private final RecommendRepository recommendRepository;

    @Autowired
    public RecommendService(RecommendRepository recommendRepository){
        this.recommendRepository = recommendRepository;
    }

    // 리뷰 삽입
    public int insertRecommend(Recommend_Plcae recommend_plcae){
        int res = recommendRepository.AddRecommend(recommend_plcae);
        return res;
    }

    // 리뷰 삭제
    public int deleteRecommend(Recommend_Plcae recommend_plcae){
        int res = recommendRepository.deleteRecommend(recommend_plcae);
        return res;
    }

    // 리뷰 받기(읽기)
    public List<Recommend_Plcae> getRecommend (Recommend_Plcae recommend_plcae){
        List<Recommend_Plcae> res = recommendRepository.getRecommend(recommend_plcae);
        return res;
    }
}
