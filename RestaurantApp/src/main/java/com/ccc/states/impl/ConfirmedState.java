package com.ccc.states.impl;

import com.ccc.enums.ReservationStatus;
import com.ccc.pojo.Reservation;
import com.ccc.states.ReservationState;

public class ConfirmedState implements ReservationState {

    @Override
    public void confirm(Reservation reservation) {
        throw new IllegalStateException("Reservation đã được xác nhận rồi.");
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
        return ReservationStatus.CONFIRMED;
    }

    @Override
    public boolean canTransitionTo(ReservationStatus newStatus) {
        return newStatus == ReservationStatus.CANCELLED || newStatus == ReservationStatus.COMPLETED;
    }
}
