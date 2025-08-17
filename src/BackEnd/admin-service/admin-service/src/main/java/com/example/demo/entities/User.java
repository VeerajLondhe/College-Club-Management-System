package com.example.demo.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "u_id")
    private int uid;

    @Column(name = "uname")
    private String uname;

    @Column(name = "d_name")
    private String dname;

    @Column(name = "email", unique = true)
    private String email;

    @JsonIgnore
    @Column(name = "password")
    private String password;

    @Column(name = "phoneno")
    private String phoneno;

    @ManyToOne
    @JoinColumn(name="r_id")
    private Role role;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Club> clubs;

    public User() {}

    public User(int uid, String uname, String dname, String email, String password, String phoneno, Role role, List<Club> clubs) {
        this.uid = uid;
        this.uname = uname;
        this.dname = dname;
        this.email = email;
        this.password = password;
        this.phoneno = phoneno;
        this.role = role;
        this.clubs = clubs;
    }

    public int getUid() {
        return uid;
    }

    public void setUid(int uid) {
        this.uid = uid;
    }

    public String getUname() {
        return uname;
    }

    public void setUname(String uname) {
        this.uname = uname;
    }

    public String getDname() {
        return dname;
    }

    public void setDname(String dname) {
        this.dname = dname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhoneno() {
        return phoneno;
    }

    public void setPhoneno(String phoneno) {
        this.phoneno = phoneno;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public List<Club> getClubs() {
        return clubs;
    }

    public void setClubs(List<Club> clubs) {
        this.clubs = clubs;
    }

    @Override
    public String toString() {
        return "User [uid=" + uid + ", uname=" + uname + ", email=" + email + ", role=" + role + "]";
    }
}