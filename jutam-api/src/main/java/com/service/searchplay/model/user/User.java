package com.service.searchplay.model.user;

import com.sun.istack.NotNull;
import lombok.*;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.*;

@Entity
@Data // getter / setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int seq;

    @NotNull
    private String name;

    @NotNull
    private String id;

    @NotNull
    private String password;

    private String nickname;

    @NotNull
    private String email;

    private String phone;

    @NotNull
    private String age;
}



