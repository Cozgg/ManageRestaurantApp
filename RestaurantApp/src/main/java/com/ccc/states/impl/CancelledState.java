package com.ccc.states.impl;

import com.ccc.enums.ReservationStatus;
import com.ccc.pojo.Reservation;
import com.ccc.states.ReservationState;

/**
 * State khi reservation đã bị hủy (Terminal state)
 */
public class CancelledState implements ReservationState {

    @Override
    public void confirm(Reservation reservation) {
        throw new IllegalStateException("Không thể xác nhận reservation đã bị hủy.");
    }

    @Override
    public void cancel(Reservation reservation) {
        throw new IllegalStateException("Reservation đã bị hủy rồi.");
    }

    @Override
    public void complete(Reservation reservation) {
        throw new IllegalStateException("Không thể hoàn thành reservation đã bị hủy.");
    }

    @Override
    public ReservationStatus getStatus() {
        return ReservationStatus.CANCELLED;
    }

    @Override
    public boolean canTransitionTo(ReservationStatus newStatus) {
        return false; // Terminal state
    }
}
