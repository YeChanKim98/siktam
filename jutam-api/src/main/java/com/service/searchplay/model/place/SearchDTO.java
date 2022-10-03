package com.service.searchplay.model.place;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchDTO {
    private Place place;
    private double averPrice;
    public SearchDTO(Place place){
        this.place = place;
    }
}
