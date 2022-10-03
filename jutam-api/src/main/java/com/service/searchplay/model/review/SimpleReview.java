package com.service.searchplay.model.review;

import com.sun.istack.NotNull;
import lombok.*;
import org.hibernate.annotations.Generated;
import org.hibernate.annotations.GenerationTime;
import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Date;

//@Entity // DB와 자동으로 이름을 매칭해서 편하게 사용하기 위한 어노테이션
@Data // 게터 / 세터가 한번에 자동으로 생긴다 ( Lombok )
@AllArgsConstructor // 생성자를 생성한다 ( 모든 변수를 받아오는 )
@NoArgsConstructor // 생성자를 생성한다 ( 아무 변수도 받아오지 않는 순수 생성자 )
public class SimpleReview{

    @Id // 프라이머리 키(주키)
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 값 자동생성 어노테이션 -> 1-N
    private int review_id; // Autoincrement, Primary Key

    @NotNull
    private Integer place_id;

    @NotNull
    private String user_id;

    @NotNull
    private String recmnd;

    @NotNull
    private String content;

    @Generated(GenerationTime.INSERT) // Default current_timestamp
    private Timestamp review_date;


}