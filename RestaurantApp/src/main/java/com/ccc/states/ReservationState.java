package com.ccc.states;

import com.ccc.enums.ReservationStatus;
import com.ccc.pojo.Reservation;

public interface ReservationState {
    void confirm(Reservation reservation);
    void cancel(Reservation reservation);
    void complete(Reservation reservation);
    ReservationStatus getStatus();  
    boolean canTransitionTo(ReservationStatus newStatus);
}
