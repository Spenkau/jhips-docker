package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.Tag;
import com.mycompany.myapp.domain.User;
import com.mycompany.myapp.service.dto.TagDTO;
import com.mycompany.myapp.service.dto.UserDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Tag} and its DTO {@link TagDTO}.
 */
@Mapper(componentModel = "spring")
public interface TagMapper extends EntityMapper<TagDTO, Tag> {
    @Mapping(target = "owner", source = "owner", qualifiedByName = "userId")
    TagDTO toDto(Tag s);

    @Named("userId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "login", source = "login")
    UserDTO toDtoUserId(User user);
}
