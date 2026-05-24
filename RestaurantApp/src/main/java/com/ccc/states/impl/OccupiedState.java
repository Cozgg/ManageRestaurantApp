package com.ccc.states.impl;

import com.ccc.enums.ReservationStatus;
import com.ccc.pojo.Reservation;
import com.ccc.states.ReservationState;

/**
 * State khi reservation đang có khách (walk-in)
 */
public class OccupiedState implements ReservationState {

    @Override
    public void confirm(Reservation reservation) {
        throw new IllegalStateException("Walk-in reservation không cần xác nhận.");
    }

    @Override
    public void cancel(Reservation reservation) {
        reservation.setStatus(ReservationStatus.CANCELLED.name());
        reservation.setState(new CancelledState());
    }

    @Override
    public void complete(Reservation reservation) {
        reservation.setStatus(ReservationStatus.COMPLETED.name());
        reservation.setState(new CompletedState());
    }

    @Override
    public ReservationStatus getStatus() {
        return ReservationStatus.OCCUPIED;
    }

    @Override
    public boolean canTransitionTo(ReservationStatus newStatus) {
        return newStatus == ReservationStatus.COMPLETED || newStatus == ReservationStatus.CANCELLED;
    }
}
