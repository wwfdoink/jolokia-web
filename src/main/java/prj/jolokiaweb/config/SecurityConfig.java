package prj.jolokiaweb.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

import prj.jolokiaweb.jolokia.AgentInfo;
import prj.jolokiaweb.jolokia.JolokiaClient;


@EnableWebSecurity
public class SecurityConfig {

    public static final String ROLE_USER = "user";

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        AgentInfo info = JolokiaClient.getAgentInfo();

        if (info.getWebUsername() != null) {
            auth.inMemoryAuthentication()
                    .withUser(info.getWebUsername())
                    .password(info.getWebPassword())
                    .roles(ROLE_USER);
        }
    }

    @Configuration
    @Order(1)
    public static class JolokiaSecurityConfig extends WebSecurityConfigurerAdapter {
        @Override
        protected void configure(HttpSecurity http) throws Exception {
            AgentInfo info = JolokiaClient.getAgentInfo();
            http.csrf().disable();

            if (info.getWebUsername() != null) {
                http.authorizeRequests()
                    .antMatchers("/static/**","/webjars/**").permitAll()
                    .antMatchers("/","/api/**","/jolokia/**","/ws").hasRole(ROLE_USER)
                    .and()
                        .httpBasic()
                        .realmName("jolokia")
                ;
            }
        }
    }
}