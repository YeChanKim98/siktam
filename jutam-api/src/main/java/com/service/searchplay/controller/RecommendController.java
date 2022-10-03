package com.service.searchplay.controller;

import com.service.searchplay.model.recommend.Recommend_Plcae;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import java.util.List;


@Controller
public class RecommendController {
    
    // 추천 장소 받기
    @CrossOrigin(origins = { "http://localhost:3000" }, allowedHeaders = "*", allowCredentials = "true")
    @RequestMapping("/getRecommend")
    public List<Recommend_Plcae> getRecommend(@RequestBody Recommend_Plcae recommend_plcae){
        return null;
    }
}
