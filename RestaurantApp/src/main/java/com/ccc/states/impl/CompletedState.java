package com.ccc.states.impl;

import com.ccc.enums.ReservationStatus;
import com.ccc.pojo.Reservation;
import com.ccc.states.ReservationState;

/**
 * State khi reservation đã hoàn thành (Terminal state)
 */
public class CompletedState implements ReservationState {

    @Override
    public void confirm(Reservation reservation) {
        throw new IllegalStateException("Không thể xác nhận reservation đã hoàn thành.");
    }

    @Override
    public void cancel(Reservation reservation) {
        throw new IllegalStateException("Không thể hủy reservation đã hoàn thành.");
    }

    @Override
    public void complete(Reservation reservation) {
        throw new IllegalStateException("Reservation đã hoàn thành rồi.");
    }

    @Override
    public ReservationStatus getStatus() {
        return ReservationStatus.COMPLETED;
    }

    @Override
    public boolean canTransitionTo(ReservationStatus newStatus) {
        return false; // Terminal state
    }
}
