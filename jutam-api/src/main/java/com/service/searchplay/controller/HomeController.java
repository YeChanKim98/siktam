package com.service.searchplay.controller;

import com.service.searchplay.model.place.Place;
import com.service.searchplay.model.user.User;
import com.service.searchplay.repository.user.UserRepository;
import com.service.searchplay.service.PlaceService;
import com.service.searchplay.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@CrossOrigin(origins = { "http://localhost:3000" }, allowedHeaders = "*", allowCredentials = "true")
public class HomeController {

    @Autowired
    PlaceService placeService;

    @RequestMapping("/dbtest")
    @ResponseBody
    public List<Place> home(){
        System.out.println("[Controller] dbtest");
        String[] ct = {"ch"};
//        List<Place> res = placeService.findByCategoryAndMoney(ct,10000,1);
        return null;
    }
}
