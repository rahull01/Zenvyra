package com.zenvyra.security;

import com.zenvyra.model.PlanType;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface RequiresCompliancePlan {
    PlanType value() default PlanType.FREE;
    String feature() default "";
    boolean enforceWebsiteQuota() default false;
    boolean enforceScanQuota() default false;
    boolean enforcePolicyQuota() default false;
}
