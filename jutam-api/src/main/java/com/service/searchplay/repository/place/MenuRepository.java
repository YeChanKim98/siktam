package com.service.searchplay.repository.place;

import com.service.searchplay.model.place.Menu;
import java.util.List;

public interface MenuRepository {
    // 장소 아이디를 받아서 메뉴를 반환
    List<Menu> getPlaceMenu(String[] placeId);
}
