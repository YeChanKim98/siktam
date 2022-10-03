package com.service.searchplay.service;

import com.service.searchplay.model.place.Place;
import com.service.searchplay.model.place.SearchDTO;
import com.service.searchplay.model.place.Search;
import com.service.searchplay.repository.place.PlaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PlaceService {

    private final PlaceRepository placeRepository;

    @Autowired
    public PlaceService(PlaceRepository placeRepository){ this.placeRepository = placeRepository; }

    // search 객체를 받아서 안에 있는 옵션에 맞게 리포지토리 메서드 호출
    public List<SearchDTO> findAround(Search search){
        List<SearchDTO> res = null;
        String[] cat = search.getCategory();
        Integer people = search.getPeople();
        Integer money = search.getMoney();
        double lat = search.getLat();
        double lng = search.getLng();
        System.out.println("[Service] 검색 요청 및 메소드 분류");
        search.toString();
        if(money > 0){
           if(cat.length!=0){ // 모든 옵션을 사용하는 경우
               System.out.println("모든 옵션");
               res = placeRepository.findByCategoryMoneyPeople(cat, money, people, lat, lng);
           }else{ // 인원과 식비만 설정하는 경우
               System.out.println("인원과 식비만");
               res = placeRepository.findByMoneyPeople(money, people, lat, lng);
           }
        }else if(cat.length != 0 && money < 0){ // 카테고리만 있는 경우
            System.out.println("카테고리만");
            res = placeRepository.findByCategory(cat,lat,lng);
        }else if(cat.length == 0 && money < 0 ){ // 옵션이 없는 경우
            System.out.println("노옵션");
            res = placeRepository.findAround(lat, lng);
        }

        return res;
    }

}
