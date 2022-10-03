package com.service.searchplay.controller;

import com.service.searchplay.model.place.Menu;
import com.service.searchplay.service.MenuService;
// import org.h2.util.json.JSONArray;
// import org.h2.util.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
// @CrossOrigin("*")
@RequestMapping(value = "api/place", method = {RequestMethod.GET, RequestMethod.POST})
public class MenuController {

    private final MenuService menuService;

    @Autowired
    public MenuController(MenuService menuService){ this.menuService = menuService; }

    @RequestMapping(value="/search/menu",method = {RequestMethod.GET, RequestMethod.POST})
    public List<Menu> getPlaceMenu(@RequestBody String[] placeId){
        System.out.println("[Controller] "+placeId[0]+"의 메뉴 정보 요청");
        List<Menu> res = menuService.getPlaceMenu(placeId);
        return res;
    }
}
