package com.service.searchplay.model.recommend;

import lombok.Data;
import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;

@Data
@Embeddable
public class RecommendKey implements Serializable {

    @Column(name = "place_id")
    private int place_id;

    @Column(name = "category")
    private String category;

    @Column(name = "action")
    private String action;

}
