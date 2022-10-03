package com.service.searchplay.repository.user;

import com.service.searchplay.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository {
    // 사용자 생성
    User join(User user);

    // id로 사용자 검색
    Optional<User> findById(String id);

    // 아이디 찾기
    String findId(String name, String email);

    // 비밀번호 찾기
    String findPassword(String id, String email);

    // 사용자 모두 출력
    List<User> findAll();

    // 사용자 삭제
    int delete(String id);

    // 사용자 수정(어드민)
    int update(User user);

    // 사용자 수정
    int updateNickname(String id, String nickname);
    int updatePassword(String id, String password);
    int updateMail(String id, String email);
    int updatePhone(String id, String phone);
}
