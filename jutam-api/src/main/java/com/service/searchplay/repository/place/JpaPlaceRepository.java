package com.service.searchplay.repository.place;

import com.service.searchplay.configuration.ResultCode;
import com.service.searchplay.model.place.SearchDTO;
import org.springframework.stereotype.Repository;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.Arrays;
import java.util.List;

@Repository
public class JpaPlaceRepository implements PlaceRepository{

    // 1안. 네이티브 쿼리를 if문으로 동적으로 조합
    // 2안. 쿼리 DSL사용하여 동적쿼리 작성
    // 3안. 메소드를 분리한다 : 컨트롤러에서 서치 객체를 넘기므로 서비스에서 분리하여, 알맞은 리포지토리 호출

    // 일단 거리 계산 제외하고 만들기
    // round(sqrt(power((lat-기준좌표),2)+power((lng-기준좌표),2))*100000) -> 범위 : 실거로 변환 해야함
    // round(st_distance_sphere(point(126.9019532, 37.5170112),point(126.9119532,37.5171102))) -> MySQL 자체 함수
    // JPQL에서 위 두 함수 모두 미지원 -> 네이티브 쿼리 사용..?

    @PersistenceContext
    private final EntityManager em;
    public JpaPlaceRepository(EntityManager em){ this.em = em; }

///////////////////////////////////////////////////[3안 : 모든 경우를 메서드로 분리]///////////////////////////////////////////////////////////////

    // 조건 : 없음 : 완
    @Override
    public List<SearchDTO> findAround(double lat, double lng) {
        List<SearchDTO> res = em.createQuery("select new com.service.searchplay.model.place.SearchDTO( pl ) from Place pl", SearchDTO.class)
                .getResultList();
        return res;
    }

    // 조건 : 카테고리 Only : 완
    @Override
    public List<SearchDTO> findByCategory(String[] category, double lat, double lng) { // 카테고리가 하나 이상이면 받을 수 있음
        // 카테고리에 해당하는 가게ID 모두 반환
        List<SearchDTO> res = em.createQuery("select new com.service.searchplay.model.place.SearchDTO( pl ) from Place pl where pl.category in :category ", SearchDTO.class)
                .setParameter("category",  Arrays.asList(category))
                .getResultList();
        res.toString();
        return res;
    }

    // 조건 : 가격 / 인원수
    @Override
    public List<SearchDTO> findByMoneyPeople(int money, int people, double lat, double lng) {
        System.out.println("[Repository] 가격 인원수를 통한 장소 검색 : ");
       List<SearchDTO> res = em.createQuery("select new com.service.searchplay.model.place.SearchDTO(p,avg(m.price)) from Place p join Menu m on p.id = m.menuKey.id where m.category = 'single' group by p.id having avg(m.price) <= :money", SearchDTO.class)
                .setParameter("money",(double)(money/people))
                .getResultList();
        return res;
    }

    // 가격 / 인원수 / 카테고리
    @Override
    public List<SearchDTO> findByCategoryMoneyPeople(String[] category, int money, int people, double lat, double lng) { // 카테고리가 하나 이상이면 받을 수 있음
        System.out.println("[Repository] 모든 옵션을 통한 장소 검색 : ");
        System.out.println(" -> Category : "+category[0]);
        System.out.println(" -> Money : "+money);
        System.out.println(" -> people : "+people);
        System.out.println(" -> calc : "+(money/people));

        List<SearchDTO> res = em.createQuery("select new com.service.searchplay.model.place.SearchDTO(p,avg(m.price)) from Place p join Menu m on p.id = m.menuKey.id where p.category in :category and  m.category = 'single' group by p.id having avg(m.price) <= :money", SearchDTO.class)
                .setParameter("category",  Arrays.asList(category))
                .setParameter("money",(double)(money/people))
                .getResultList();

        return res;

    }
}