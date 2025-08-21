package com.ccms.system.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ccms.system.entities.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role,Integer> {

}
