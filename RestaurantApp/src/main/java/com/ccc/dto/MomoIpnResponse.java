/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *
 * @author Admin
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MomoIpnResponse {

    private String partnerCode;
    private String orderId;
    private String requestId;
    private Long amount;
    private String orderInfo;
    private String orderType;
    private Long transId;
    private Integer resultCode;
    private String message;
    private String payType;
    private Long responseTime;
    private String extraData;
    private String signature;

    @Override
    public String toString() {
        return "MomoIpnResponse{"
                + "partnerCode='" + partnerCode + '\''
                + ", orderId='" + orderId + '\''
                + ", requestId='" + requestId + '\''
                + ", amount=" + amount
                + ", orderInfo='" + orderInfo + '\''
                + ", orderType='" + orderType + '\''
                + ", transId=" + transId
                + ", resultCode=" + resultCode
                + ", message='" + message + '\''
                + ", payType='" + payType + '\''
                + ", responseTime=" + responseTime
                + ", extraData='" + extraData + '\''
                + ", signature='" + signature + '\''
                + '}';
    }
}
