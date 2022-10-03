package com.service.searchplay.controller;

import com.service.searchplay.model.place.SearchDTO;
import com.service.searchplay.model.place.Search;
import com.service.searchplay.service.PlaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
// @CrossOrigin(origins = "*")
@RequestMapping(value = "api/place", method = {RequestMethod.GET, RequestMethod.POST})
class PlaceController {

    private final PlaceService placeService;

    @Autowired
    public PlaceController(PlaceService placeService){this.placeService = placeService;}

    // 옵션이 없는 경우
    @RequestMapping(value="/search/around",method = {RequestMethod.GET, RequestMethod.POST})
    public List<SearchDTO> searchAround(@RequestBody Search search){
        System.out.println("[Controller] 장소 검색 요청");
        search.toString();
        List<SearchDTO> res = placeService.findAround(search);
        return res;
    }

}
