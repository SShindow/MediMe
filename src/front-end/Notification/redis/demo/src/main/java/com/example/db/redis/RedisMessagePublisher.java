package com.example.db.redis;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;

import com.example.db.payload.RedisNotificationPayload;

@Service
public class RedisMessagePublisher implements MessagePublisher {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    @Autowired
    private ChannelTopic topic;

    public RedisMessagePublisher(){
    }

    public RedisMessagePublisher(
                final RedisTemplate<String, Object> redisTemplate,
                final ChannelTopic topic) {
        this.redisTemplate = redisTemplate;
        this.topic = topic;
    }

    public void publish(final RedisNotificationPayload message) {
        redisTemplate.convertAndSend(topic.getTopic(), message);
    }
}
