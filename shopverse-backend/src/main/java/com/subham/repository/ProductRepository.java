package com.subham.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.subham.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
