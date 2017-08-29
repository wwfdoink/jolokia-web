package prj.jolokiaweb.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import prj.jolokiaweb.jolokia.AgentInfo;
import prj.jolokiaweb.jolokia.JolokiaClient;

@EnableWebSecurity
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        AgentInfo info = JolokiaClient.getAgentInfo();
        if (info.getWebUsername() != null) {
            http.csrf().disable()
                    .authorizeRequests()
                    .antMatchers("/static/**", "/webjars/**", "/auth/**").permitAll()
                    .antMatchers("/", "/api/**", "/jolokia/**").hasRole("USER")
                    .and()
                    .httpBasic();
        }
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        AgentInfo info = JolokiaClient.getAgentInfo();

        if (info.getWebUsername() != null) {
            auth.inMemoryAuthentication()
                    .withUser(info.getWebUsername()).password(info.getWebPassword()).roles("USER");
        }
    }
}