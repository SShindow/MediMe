package com.example.db.redis;

import com.example.db.payload.RedisNotificationPayload;

public interface MessagePublisher {
    void publish(final RedisNotificationPayload message);
}
