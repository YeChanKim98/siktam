package com.service.searchplay.controller;

import com.service.searchplay.model.resv.Reserve;
import com.service.searchplay.service.ReserveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:3000"} , allowedHeaders = "*", allowCredentials = "true")
@RequestMapping(value = "api/reserve", method = {RequestMethod.GET, RequestMethod.POST})
public class ReserveController {

    private final ReserveService reserveService;

    @Autowired
    public ReserveController(ReserveService reserveService){
        this.reserveService = reserveService;
    }

    @PostMapping("/request") //폼에서 쓴값들 가지고옴
    public String reserveRequest(Reserve reserve){
        reserveService.reserveRequest(reserve);
        return "reserve.html";
    }

    @PostMapping("/getReserve/user/{req_user}")
    public List<Reserve> findByUserId(@RequestParam String req_user){
        List<Reserve> res = reserveService.findByUserId(req_user);
        return res;
    }

    @PostMapping("/getReserve/place/{rsrv_pla}")
    public List<Reserve> findByPlaceId(@RequestParam int rsrv_pla){
        List<Reserve> res = reserveService.findByPlaceId(rsrv_pla);
        return res;
    }

    @PostMapping("/pms/update/{rsrv_pms}")
    public boolean pmsUpdate(@RequestBody Reserve reserve){
        boolean res = reserveService.pmsUpdate(reserve.getRsrv_pms(), reserve.getRsrv_pla());
        return res;
    }

}
