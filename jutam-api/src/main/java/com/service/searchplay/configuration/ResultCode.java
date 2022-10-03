package com.service.searchplay.configuration;

public enum ResultCode {
// String resCode = ResultCode.DELETE_SUCCESS.name(); // name()은 toString()과 같은 상수값을 반환한다
    CERTIFIED_FAIL,
    WRITE_SUCCESS, //작성 성공
    WRITE_FAIL, //작성 실패
    DELETE_SUCCESS, //삭제 성공
    DELETE_FAIL, //삭제 실패
    UPDATE_SUCCESS, //수정 성공
    UPDATE_FAIL; //수정 실패

}
