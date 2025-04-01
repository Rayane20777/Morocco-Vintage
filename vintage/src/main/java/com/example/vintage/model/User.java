package com.example.vintage.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;
import java.util.List;

@Data
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String username;

    private String password;

    private String firstName;

    private String lastName;

    private String email;

    private String phoneNumber;

    private Boolean active;

    private String imageId;

    @Field("dateAdded")
    private Date dateAdded = new Date();

    @DBRef
    private List<Role> roles;

}
