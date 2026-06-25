package com.zenvyra.system;

import org.springframework.stereotype.Service;

@Service
public class HealthCheckService {

    public String check() {
        return "System Healthy";
    }
}
