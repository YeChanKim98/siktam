package com.service.searchplay.repository.place;

import com.service.searchplay.model.place.Place;
import com.service.searchplay.model.place.SearchDTO;

import java.util.List;

public interface PlaceRepository {
    /////////////////////////////////[3안 : 모든 경우를 메소드로 분리]///////////////////////////////////
    // 옵션이 없는 경우
    List<SearchDTO> findAround(double lat, double lng);

    // 카테고리만 있는 경우
    List<SearchDTO> findByCategory(String[] category, double lat, double lng); // 카테고리 여러개 선택시

    // 식비 / 인원수 만 있는 경우
    List<SearchDTO> findByMoneyPeople(int money, int people, double lat, double lng);

    // 카테고리 / 식비 / 인원 모두 있는 경우
    List<SearchDTO> findByCategoryMoneyPeople(String[] category, int money, int people, double lat, double lng);
}
