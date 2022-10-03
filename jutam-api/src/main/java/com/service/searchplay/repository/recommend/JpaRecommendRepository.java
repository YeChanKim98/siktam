package com.service.searchplay.repository.recommend;

import com.service.searchplay.model.recommend.Recommend_Plcae;
import com.service.searchplay.model.resv.Reserve;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Repository
public class JpaRecommendRepository implements RecommendRepository {

    @PersistenceContext
    private final EntityManager em;
    public JpaRecommendRepository(EntityManager em){
        this.em = em;
    }


    @Override
    public int AddRecommend(Recommend_Plcae recommend_plcae) {
        return 0;
    }

    @Override
    public List<Recommend_Plcae> getRecommend(Recommend_Plcae recommend_plcae) {
        return null;
    }

    @Override
    public int deleteRecommend(Recommend_Plcae recommend_plcae) {
        return 0;
    }
}
