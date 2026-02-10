package com.subham.entity;




import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private double price;
    private double originalPrice;
    private String category;
    private double rating;
    private int reviews;
    private String badge;
    private String icon;
}

