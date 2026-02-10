package com.subham.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.subham.entity.Orders;

public interface OrderRepository extends JpaRepository<Orders, Long> {
	
	  List<Orders> findByUserEmail(String userEmail);
}

