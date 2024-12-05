package com.desarrollo.criminal.configuration.security;



import com.desarrollo.criminal.service.UserService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.List;

@Slf4j
@AllArgsConstructor
@Component
public class CustomJwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    private final UserService userService;

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        String email = jwt.getClaim("https://criminal-cross.com/email");
        System.out.println("Email: " + email);
        log.info(jwt.toString());
        List<GrantedAuthority> authority = (List<GrantedAuthority>) userService.getAuthorityByEmail(email);
        log.info("Authorities: {}", authority);
        return new JwtAuthenticationToken(jwt, authority);
    }

}
