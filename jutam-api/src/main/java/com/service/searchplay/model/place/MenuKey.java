package com.service.searchplay.model.place;

import lombok.Data;
import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;

@Data
@Embeddable
public class MenuKey implements Serializable {

    @Column(name = "id")
    private String id;

    @Column(name = "name")
    private String name;

}
