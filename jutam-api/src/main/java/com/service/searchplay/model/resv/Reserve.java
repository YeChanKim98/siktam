package com.service.searchplay.model.resv;

import com.sun.istack.NotNull;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Generated;
import org.hibernate.annotations.GenerationTime;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RequestParam;

import javax.persistence.*;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

//@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reserve {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int rsrv_seq;

    @NotNull
    private Integer rsrv_pla;

    @NotNull
    private String req_user;

    @NotNull
    private String req_tel;

    @NotNull
    private Integer rsrv_cnt;

    @NotNull
    private String rsrv_pms;

    @NotNull
    private String rsrv_time;

    @Generated(GenerationTime.INSERT)
    private Timestamp req_time;

    @PrePersist
    public void onPrePersist() {
        this.rsrv_time = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }
}
