package com.desarrollo.criminal.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        /* authorizeRequests(authorizeRequests -> authorizeRequests
                .antMatchers("/public/**").permitAll()  // Permitir acceso público
                .antMatchers("/clientes/**").hasAuthority("ROLE_CLIENTE") // Requiere el rol de cliente
                .antMatchers("/admin/**").hasAuthority("ROLE_ADMIN")  // Requiere el rol de admin
                .anyRequest().authenticated()  // Requerir autenticación para todas las demás rutas
            )
            .oauth2ResourceServer(oauth2 -> oauth2.jwt());  // Habilitar la validación de JWT*/
        return http.build();
    }

}
