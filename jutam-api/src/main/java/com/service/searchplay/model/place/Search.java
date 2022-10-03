package com.service.searchplay.model.place;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Search {
    // 프론트에서 보내는 정보를 담기위한 객체
    private String[] category;
    private Integer people;
    private Integer money;
    private double lat;
    private double lng;
}
