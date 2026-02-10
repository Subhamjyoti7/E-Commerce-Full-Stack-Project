package com.subham.entity;


import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String productName;
    private int quantity;
    private double totalPrice;
    
    private String userEmail;
    
    private LocalDateTime createdAt = LocalDateTime.now();

    // getters & setters
    public String getUserEmail() {
        return userEmail;
    }
    
    

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }
}
