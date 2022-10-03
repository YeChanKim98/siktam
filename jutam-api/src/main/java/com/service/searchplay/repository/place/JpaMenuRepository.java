package com.service.searchplay.repository.place;

import com.service.searchplay.model.place.Menu;
import org.springframework.stereotype.Repository;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.Arrays;
import java.util.List;

@Repository
public class JpaMenuRepository implements MenuRepository{

    @PersistenceContext
    private final EntityManager em;
    public JpaMenuRepository(EntityManager em){ this.em = em;}

    @Override
    public List<Menu> getPlaceMenu(String[] placeId) {
        System.out.println("[Repository] 메뉴정보 요청");
        List<Menu> res = em.createQuery("select m from Menu m where m.menuKey.id in :placeId", Menu.class)
                .setParameter("placeId", Arrays.asList(placeId))
                .getResultList();
        return res;
    }
}
