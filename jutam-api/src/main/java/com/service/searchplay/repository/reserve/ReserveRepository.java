package com.service.searchplay.repository.reserve;

import com.service.searchplay.model.resv.Reserve;

import java.util.List;

public interface ReserveRepository {
    Reserve reserveRequest(Reserve reserve);

    List<Reserve> findByUserId(String req_user);

    List<Reserve> findByPlaceId(int rsrv_pla);

    int pmsUpdate(String rsrv_pms, int rsrv_pla);
}
