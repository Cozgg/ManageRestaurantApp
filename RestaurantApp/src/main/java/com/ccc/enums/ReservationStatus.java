package com.ccc.enums;

/**
 * Enum cho các trạng thái của Reservation
 * Áp dụng State Pattern để quản lý trạng thái một cách an toàn
 */
public enum ReservationStatus {
    PENDING("Chờ xác nhận"),
    CONFIRMED("Đã xác nhận"),
    CANCELLED("Đã hủy"),
    COMPLETED("Hoàn thành"),
    OCCUPIED("Đang có khách");

    private final String displayName;

    ReservationStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public boolean canTransitionTo(ReservationStatus newStatus) {
        switch (this) {
            case PENDING:
                return newStatus == CONFIRMED || newStatus == CANCELLED;
            case CONFIRMED:
                return newStatus == CANCELLED || newStatus == COMPLETED;
            case OCCUPIED:
                return newStatus == COMPLETED || newStatus == CANCELLED;
            case CANCELLED:
            case COMPLETED:
                return false; 
            default:
                return false;
        }
    }
}
