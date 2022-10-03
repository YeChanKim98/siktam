package com.service.searchplay.model.recommend;

import com.sun.istack.NotNull;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;

//@Entity
@Data
//@Table // 하이픈 없는 이름으로 변경
@NoArgsConstructor
@AllArgsConstructor
public class Recommend_Plcae {

    @EmbeddedId // 복합키
    private RecommendKey recommendKey;

    @NotNull
    private String location;

    @NotNull
    private String user_id;

    private int user_age;

    private String user_gender;

}
