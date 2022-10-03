package com.service.searchplay.repository.recommend;

import com.service.searchplay.model.recommend.Recommend_Plcae;
import com.service.searchplay.model.resv.Reserve;

import java.util.List;

public interface RecommendRepository {
    
    // 추천 데이터 누적 : insert
    int AddRecommend(Recommend_Plcae recommend_plcae);
    
    // 추천 데이터 조회 : select
    List<Recommend_Plcae> getRecommend(Recommend_Plcae recommend_plcae);
    
    // 추천 데이터 삭제 : delete -> 특정 상황에 대비하여 생성, 평소에 사용 안 함
    int deleteRecommend(Recommend_Plcae recommend_plcae);
}
