/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.configs;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.FanoutExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.config.RetryInterceptorBuilder;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.rabbit.retry.RejectAndDontRequeueRecoverer;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.retry.interceptor.RetryOperationsInterceptor;

/**
 *
 * @author Admin
 */
@Configuration
@EnableRabbit
public class RabbitMQConfig {

    @Bean
    public ConnectionFactory connectionFactory() {
        String rabbitHost = System.getProperty("rabbitmq.host", "localhost");
        CachingConnectionFactory factory = new CachingConnectionFactory(rabbitHost);
        factory.setPort(5672);
        factory.setUsername("admin");
        factory.setPassword("admin");
        factory.setVirtualHost("/");
        return factory;
    }

    @Bean
    public RabbitAdmin rabbitAdmin(ConnectionFactory connectionFactory) {
        return new RabbitAdmin(connectionFactory);
    }

    // 3. Converter: Tự động parse Object <-> JSON
    @Bean
    public Jackson2JsonMessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter());
        return template;
    }

    @Bean
    public RetryOperationsInterceptor retryInterceptor() {
        return RetryInterceptorBuilder.stateless()
                .maxAttempts(3)
                .backOffOptions(2000, 2.0, 10000)
                .recoverer(new RejectAndDontRequeueRecoverer())
                .build();
    }

    @Bean
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(ConnectionFactory connectionFactory) {
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setMessageConverter(jsonMessageConverter());
        factory.setPrefetchCount(1);
        factory.setAdviceChain(retryInterceptor());
        return factory;
    }

    // --- 1. ĐỊNH NGHĨA DEAD LETTER QUEUE (DLQ) ---
    // Nơi chứa các tin nhắn bị lỗi
    @Bean
    public DirectExchange deadLetterExchange() {
        return new DirectExchange("dlx.payment");
    }

    @Bean
    public Queue deadLetterQueue() {
        return QueueBuilder.durable("dlq.payment_failed").build();
    }

    @Bean
    public Binding dlqBinding(@Qualifier("deadLetterQueue") Queue deadLetterQueue, DirectExchange deadLetterExchange) {
        return BindingBuilder.bind(deadLetterQueue).to(deadLetterExchange).with("payment.dlq.key");
    }

    @Bean
    public Binding bindSendEmail(@Qualifier("sendEmailQueue") Queue sendEmailQueue, FanoutExchange paymentSuccessExchange) {
        return BindingBuilder.bind(sendEmailQueue).to(paymentSuccessExchange);
    }

    @Bean
    public Binding bindNotifyChef(@Qualifier("notifyChefQueue") Queue notifyChefQueue, FanoutExchange paymentSuccessExchange) {
        return BindingBuilder.bind(notifyChefQueue).to(paymentSuccessExchange);
    }

    @Bean
    public Binding bindAnalytics(@Qualifier("analyticsQueue") Queue analyticsQueue, FanoutExchange paymentSuccessExchange) {
        return BindingBuilder.bind(analyticsQueue).to(paymentSuccessExchange);
    }

    // --- 2. ĐỊNH NGHĨA MAIN EXCHANGE (FANOUT) ---
    @Bean
    public FanoutExchange paymentSuccessExchange() {
        return new FanoutExchange("ex.payment_success");
//        return new FanoutExchange("ex.payment_success", false, false); [cite: 372]
    }

    // --- 3. ĐỊNH NGHĨA 4 QUEUES CHÍNH (Có gắn DLQ) ---
    private Queue createQueueWithDLQ(String queueName) {
        return QueueBuilder.durable(queueName)
                .deadLetterExchange("dlx.payment")
                .deadLetterRoutingKey("payment.dlq.key")
                .build();
    }

    @Bean
    public Queue sendEmailQueue() {
        return createQueueWithDLQ("q.payment.send_email");
    }

    @Bean
    public Queue notifyChefQueue() {
        return createQueueWithDLQ("q.payment.notify_chef");
    }

    @Bean
    public Queue analyticsQueue() {
        return createQueueWithDLQ("q.payment.analytics");
    }

}
