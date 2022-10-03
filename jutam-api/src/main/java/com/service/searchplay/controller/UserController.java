package com.service.searchplay.controller;

import com.service.searchplay.model.user.User;
import com.service.searchplay.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = {"http://localhost:3000"}, allowedHeaders = "*", allowCredentials = "true")
@RequestMapping(value = "/api/user", method = {RequestMethod.GET, RequestMethod.POST})
public class UserController {
    // 전반적으로 부가기능 없음
    // 1. 본인 확인 기능
    
    private final UserService userService;

    // 생성자로 연결
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // 회원가입
    @PostMapping("/join")
    public String join(User user){
        String res = userService.join(user);
        return res;
    }

    // 로그인
    @PostMapping("/login")
    public String login(@RequestBody User user, HttpServletRequest request){
        Optional<User> resUser = userService.findOneUser(user.getId());
        if(!resUser.isEmpty()){ // 결과가 있으면
            User result = resUser.get();
           if(result.getPassword().equals(user.getPassword())){ // 비밀번호가 일치하면
                HttpSession session = request.getSession();
                session.setAttribute("user_id",result.getId());
                System.out.println(result.getId()+"반환");
                return result.getId(); // 로그인 성공
           }else{
               return "Incorrect_Password"; // 비밀번호 불일치
           }
        }else{
            return "Not_Exist_ID"; // 없는 ID
        }
    }

    // 로그아웃
    @PostMapping("/logout")
    public String logout(@RequestBody User user, HttpServletRequest request){
        HttpSession session = request.getSession();
        String get_user_id = user.getId();
        String session_user_id =  session.getAttribute("user_id").toString();
        System.out.println("[Controller] 유저 "+get_user_id+"의 로그아웃 요청 / 현재 세션 : "+ session_user_id);
        if (get_user_id.equals(session_user_id)){
            System.out.println(get_user_id+" Equal To "+session_user_id);
            session.removeAttribute("user_id");
            return "Success_User_Logout"; // 로그아웃
        }else
            System.out.println(get_user_id+" Not Equal To "+session_user_id);
            return "Incorrect_Request"; // 올바르지 않은 요청
    }

    // Id 중복 체크
    @PostMapping("/checkId/{checkid}")
    public int checkId(@PathVariable String check_id){
        int res = userService.checkId(check_id);
        return res; // 중복 : 0 / 비중복 : 1
    }

    // Id 찾기
    @PostMapping("/find/id")
    public String findId(@RequestBody User user){
        // 입력받은 값에서 확인조건에 해당하는 값을 꺼내 확인.
        return null;
    }

    // Password 찾기
    @PostMapping("/find/password")
    public String findPassword(@RequestBody User user){
        // 입력받은 값에서 확인조건에 해당하는 값을 꺼내 확인.
        return null;
    }
//
//    // 사용자 조회
//    @GetMapping("/admin/userList")
//    public String list(Model model){
//        List<User> users = userService.findAllUser();
//        model.addAttribute("users", users);
//        return "/projects/admin/userList";
//    }
//
//    // 관리자 전용 페이지
//    @GetMapping("/admin/adminMain")
//    public String admin(){
//        return "/projects/admin/adminMain";
//    }
//
//    // 사용자 정보 수정(관리자)
//    @GetMapping("/admin/user/update")
//    public String adminUpdate_form(@PathVariable String id, Model model){
//        User user = userService.findOneUser(id).get();
//        model.addAttribute("userInfo",user);
//        return "/projects/admin/userUpdate";
//    }
//
//    @PostMapping("/admin/user/update")
//    public String adminUpdate(User user){
//        int res  = userService.update(user);
//        if(res==1){
//            System.out.println("계정정보 업데이트 성공!");
//        }else{
//            System.out.println("계정정보 업데이트 실패!");
//        }
//        return "redirect:/admin/userList";
//    }
//
//    // 사용자 삭제(관리자)
//    public String adminDelete(@PathVariable String id){
//        userService.delete(id);
//        return "redirect:/admin/user/userList";
//    }
//
//    // 사용자 전용 페이지
//    @GetMapping("/users/myPage")
//    public String page(){
//        return "/projects/users/myPage";
//    }
//
//    // 사용자 정보 수정(사용자)
//    public String userUpdate(){
//        return "null";
//    }
//
//    // 사용자 탈퇴(사용자)
//    @GetMapping("/user/withdraw")
//    public String userDelete_form(Model model){
//        model.addAttribute("탈퇴","withdraw");
//        return "/projects/users/withdraw";
//    }
//
//    @PostMapping("/users/withdraw")
//    public String userDelete(@RequestParam String password, HttpServletRequest request){
//        HttpSession session = request.getSession();
//        String id = session.getAttribute("loginID").toString();
//        if(id.equals("Admin")){
//            return "redirect:/";
//        }
//        User user = userService.findOneUser(id).get();
//        if(user.getPassword().equals(password)){
//            userService.delete(password);
//            session.removeAttribute("loginID");
//            return "/projects/users/withdraw";
//        }else{
//            System.out.println("비밀번호 불일치");
//            return "redirect:/";
//        }
//    }
}
