package com.ccc.states.impl;

import com.ccc.enums.ReservationStatus;
import com.ccc.pojo.Reservation;
import com.ccc.states.ReservationState;

/**
 * State khi reservation đang chờ xác nhận
 */
public class PendingState implements ReservationState {

    @Override
    public void confirm(Reservation reservation) {
        reservation.setStatus(ReservationStatus.CONFIRMED.name());
        reservation.setState(new ConfirmedState());
    }

    @Override
    public void cancel(Reservation reservation) {
        reservation.setStatus(ReservationStatus.CANCELLED.name());
        reservation.setState(new CancelledState());
    }

    @Override
    public void complete(Reservation reservation) {
        throw new IllegalStateException("Không thể hoàn thành reservation đang chờ xác nhận. Hãy xác nhận trước.");
    }

    @Override
    public ReservationStatus getStatus() {
        return ReservationStatus.PENDING;
    }

    @Override
    public boolean canTransitionTo(ReservationStatus newStatus) {
        return newStatus == ReservationStatus.CONFIRMED || newStatus == ReservationStatus.CANCELLED;
    }
}
