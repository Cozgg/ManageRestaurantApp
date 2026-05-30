package com.ccc.enums;

public enum ReservationStatus {
    RESERVED("Đã đặt / Đang sử dụng"),
    COMPLETED("Hoàn thành"),
    CANCELLED("Đã hủy");

    private final String displayName;

    ReservationStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public boolean canTransitionTo(ReservationStatus newStatus) {
        switch (this) {
            case RESERVED:
                return newStatus == COMPLETED || newStatus == CANCELLED;
            case CANCELLED:
            case COMPLETED:
                return false;
            default:
                return false;
        }
    }
}
