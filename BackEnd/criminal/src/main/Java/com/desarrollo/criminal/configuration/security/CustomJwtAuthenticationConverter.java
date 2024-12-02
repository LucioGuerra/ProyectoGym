package com.desarrollo.criminal.configuration.security;



import com.desarrollo.criminal.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.Collection;

@AllArgsConstructor
@Component
public class CustomJwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    private final UserService userService;

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        String email = jwt.getClaim("email");
        Collection<GrantedAuthority> authority = userService.getAuthorityByEmail(email);
        return new JwtAuthenticationToken(jwt, authority);
    }

}
