package com.service.searchplay.model.place;

import com.sun.istack.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Menu {

//    @NotNull
//    private  place_category;

    @EmbeddedId
    private MenuKey menuKey;

    @NotNull
    private String place_category;

    @NotNull
    private String category;

    @NotNull
    private int price;

}
