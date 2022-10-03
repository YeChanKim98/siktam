package com.service.searchplay.service;

import com.service.searchplay.model.place.Menu;
import com.service.searchplay.repository.place.MenuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class MenuService {

    private final MenuRepository menuRepository;

    @Autowired
    public MenuService(MenuRepository menuRepository){ this.menuRepository = menuRepository; }

    public List<Menu> getPlaceMenu(String[] placeId){
        System.out.println("[Service] 메뉴정보 요청");
        List<Menu> res = menuRepository.getPlaceMenu(placeId);
        return res;
    }
}
