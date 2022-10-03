package com.service.searchplay.service;

import com.service.searchplay.model.user.User;
import com.service.searchplay.repository.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import javax.transaction.Transactional;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {
    SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    // 회원가입
    public String join(User user){
        int chid = checkId(user.getId());
        if(chid == 1){
            userRepository.join(user);
            return user.getName();
        }else{
            return "Join Fail";
        }
    }

    // 모든 사용자 검색
    public List<User> findAllUser(){
        return userRepository.findAll();
    }

    // id를 통한 사용자 확인 : 로그인
    public Optional<User> findOneUser(String id){
        return userRepository.findById(id);
    }

    // 아이디 찾기
    public String findId(String name, String address) {
        return userRepository.findId(name, address);
    }

    // 비밀번호 찾기
    public String findPassword(String id, String address) {
        return userRepository.findPassword(id, address);
    }

    // id로 사용자 삭제
    public int delete(String id){
        return userRepository.delete(id);
    }

    // 사용자 수정(어드민)
    public int update(User user){
        return userRepository.update(user);
    }

    // 사용자 수정(닉네임)
    public int updateNickname(String id, String nickname){
        return userRepository.updateNickname(id, nickname);
    }

    // 사용자 수정(비밀번호)
    public int updatePassword(String id, String password){
        return userRepository.updatePassword(id, password);
    }

    // 사용자 수정(이메일)
    public int updateMail(String id, String mail){
        return userRepository.updateMail(id, mail);
    }

    // 사용자 수정(번호)
    public int updatePhone(String id, String phone){
        return userRepository.updatePhone(id, phone);
    }

    // id 중복 확인
    public int checkId(String id) {
        return (userRepository.findById(id).isPresent())? 0 : 1;
    }

    // nickname 중복 확인
    private int checkNickname(User user){
        return (userRepository.findById(user.getNickname()).isPresent())? 0 : 1;
    }


}
