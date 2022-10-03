package com.example.db.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.example.db.payload.NotificationRequest;
import com.example.db.payload.RedisNotificationPayload;
import com.example.db.redis.RedisMessagePublisher;
import com.example.db.service.EmitterService;

import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@CrossOrigin("*")
public class NotificationController {
    
    @Autowired
    private EmitterService emitterService;

    @Autowired
    private RedisMessagePublisher redisMessagePublisher;

    @GetMapping("/subscription")
    public SseEmitter subscribe() {
        log.info("subscribing...");

        SseEmitter emitter = new SseEmitter(24 * 60 * 60 * 1000L);
        emitterService.addEmitter(emitter);

        log.info("subscribed");
        return emitter;
    }

    @PostMapping("/notification/{username}")
    public ResponseEntity<?> send(
                    @PathVariable String username, 
                    @RequestBody NotificationRequest request) {

        redisMessagePublisher.publish(
            new RedisNotificationPayload(
                username,
                request.getFrom(),
                request.getMessage()
            )
        );
        return ResponseEntity.ok().body("message pushed to user {}" + username);
    }
}
