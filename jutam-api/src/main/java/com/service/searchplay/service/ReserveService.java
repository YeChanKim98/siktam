package com.service.searchplay.service;

import com.service.searchplay.model.resv.Reserve;
import com.service.searchplay.repository.reserve.ReserveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class ReserveService {

    private final ReserveRepository reserveRepository;

    @Autowired
    public ReserveService(ReserveRepository reserveRepository){
        this.reserveRepository = reserveRepository;
    }

    // 메인메소드, 예약상태, 예약조회, 예약수정, 예약취소, 유저아이디랑 장소는 아직 잘모르겠다 ...

    public Reserve reserveRequest(Reserve reserve){ //폼에서 쓴값들 가지고옴
        Reserve res = reserveRepository.reserveRequest(reserve);
        return res;
    }

    public List<Reserve> findByUserId(String req_user){ //해당사용자 아이디로 작성한 예약글 조회
        List<Reserve> res = reserveRepository.findByUserId(req_user);
        return res;
    }

    public List<Reserve> findByPlaceId(int rsrv_pla){ // 해당 가게아이디로 등록되어있는 예약글 조회
        List<Reserve> res = reserveRepository.findByPlaceId(rsrv_pla);
        return res;
    }

    public Boolean pmsUpdate(String rsrv_pms, int rsrv_pla){
        int res = reserveRepository.pmsUpdate(rsrv_pms, rsrv_pla);
        if(res>0) return true;
        else return false;
    }
}
