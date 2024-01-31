package com.mycompany.myapp.service.mapper;

import org.junit.jupiter.api.BeforeEach;

class CommentMapperTest {

    private CommentMapper commentMapper;

    @BeforeEach
    public void setUp() {
        commentMapper = new CommentMapperImpl();
    }
}
