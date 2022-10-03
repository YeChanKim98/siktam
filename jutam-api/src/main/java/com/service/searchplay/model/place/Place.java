package com.service.searchplay.model.place;

import com.sun.istack.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Transient;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Place {

    @Id
    private String id;

    @NotNull
    private String category;

    private String img;

    @NotNull
    private String name;

    @NotNull
    private String address;

    private String tel;

    @NotNull
    private String lat;

    @NotNull
    private String lng;

//    // DB 바인딩 없는 변수
//    @Transient
//    private int averPrice;
}
