package com.zenvyra.config;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import java.time.Duration;

@Configuration
@EnableMongoRepositories(basePackages = "com.zenvyra.repository")
public class MongoConfig extends AbstractMongoClientConfiguration {

    @Value("${spring.data.mongodb.uri}")
    private String mongoUri;

    /**
     * Derive the database name from the connection string so per-environment URIs
     * (e.g. {@code mongodb://host/Zenvyra_test}) are honoured without changing code.
     * Falls back to the production default when the URI has no path component.
     */
    @Override
    protected String getDatabaseName() {
        ConnectionString connectionString = new ConnectionString(mongoUri);
        return connectionString.getDatabase() != null ? connectionString.getDatabase() : "Zenvyra";
    }

    /**
     * Explicit Mongo client settings: pool size, socket timeouts, and heartbeat frequency.
     * Pool size is sized for the API + background worker load; sockets time out aggressively
     * so a slow Mongo node fails requests fast rather than tying up Tomcat threads.
     */
    @Bean
    public MongoClientSettings mongoClientSettings() {
        return MongoClientSettings.builder()
                .applyConnectionString(new ConnectionString(mongoUri))
                .applyToConnectionPoolSettings(builder -> builder
                        .minSize(10)
                        .maxSize(50)
                        .maxWaitTime(Duration.ofSeconds(5))
                        .maxConnectionIdleTime(Duration.ofMinutes(10)))
                .applyToSocketSettings(builder -> builder
                        .connectTimeout(Duration.ofSeconds(5))
                        .readTimeout(Duration.ofSeconds(10)))
                .applyToServerSettings(builder -> builder
                        .heartbeatFrequency(Duration.ofSeconds(10), Duration.ofSeconds(5)))
                .build();
    }

    @Override
    @Bean
    public MongoClient mongoClient() {
        return MongoClients.create(mongoClientSettings());
    }

    @Bean
    public MongoTemplate mongoTemplate() {
        return new MongoTemplate(mongoClient(), getDatabaseName());
    }
}
