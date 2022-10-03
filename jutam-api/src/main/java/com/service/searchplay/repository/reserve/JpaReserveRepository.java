package com.service.searchplay.repository.reserve;

import com.service.searchplay.model.resv.Reserve;
import org.springframework.stereotype.Repository;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Repository
public class JpaReserveRepository implements ReserveRepository {

    @PersistenceContext
    private final EntityManager em;
    public JpaReserveRepository(EntityManager em){
        this.em = em;
    }

    @Override
    public Reserve reserveRequest(Reserve reserve){
        em.persist(reserve);
        return reserve;
    }

    // 예약조회용 select 필요, 예약상태용 update 필요, 예약취소용 delete 필요
    // 예약작성용도 필요한가 ...?

    @Override
    public List<Reserve> findByPlaceId(int rsrv_pla) {
        return em.createQuery("select rsv from Reserve rsv where rsv.rsrv_pla=:rsrv_pla", Reserve.class)
                .setParameter("rsrv_pla",rsrv_pla)
                .getResultList();
    }

    @Override
    public List<Reserve> findByUserId(String req_user) {
        return em.createQuery("select rsv from Reserve rsv where rsv.req_user=:req_user", Reserve.class)
                .setParameter("req_user",req_user)
                .getResultList();
    }

    @Override
    public int pmsUpdate(String rsrv_pms, int rsrv_pla) {
        return em.createQuery("update Reserve rsv set rsv.rsrv_pms=:rsrv_pms where rsv.rsrv_pla=:rsrv_pla")
                .setParameter("rsrv_pms", rsrv_pms)
                .setParameter("rsrv_pla", rsrv_pla)
                .executeUpdate();
    }
}
