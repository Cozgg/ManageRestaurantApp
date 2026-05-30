/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.controllers;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.ccc.dto.UserDto;
import com.ccc.repository.ReservationRepository;
import com.ccc.service.ReservationService;
import com.ccc.service.TableService;
import com.ccc.service.UserService;

/**
 *
 * @author Admin
 */
@Controller
@RequestMapping("/admin")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private TableService tableService;

    @Autowired
    private ReservationRepository reservationRepository;

    @GetMapping("/login")
    public String loginView() {
        return "login";
    }

    @GetMapping("/users")
    public String usersView(Model model) {
        model.addAttribute("users", this.userService.getUsers());
        return "manage-user";
    }

    @GetMapping("/users/create")
    public String createUserView(Model model) {
        model.addAttribute("userDto", new UserDto());
        model.addAttribute("roles", this.userService.getUserRoles());
        return "users";
    }

    @GetMapping("/users/{userId}")
    public String updateUserView(Model model, @PathVariable("userId") int userId) {
        model.addAttribute("user", this.userService.getUserById(userId));
        return "users";
    }

    @PostMapping("/users")
    public String createUser(@ModelAttribute(value = "userDto") UserDto u) {
        this.userService.addUser(u);
        return "redirect:/admin/users";
    }

    @GetMapping("/reservations")
    public String reservationsView(Model model,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "page", required = false) String page) {
        Map<String, String> params = new java.util.HashMap<>();
        if (status != null && !status.isEmpty()) {
            params.put("status", status);
        }
        if (page != null && !page.isEmpty()) {
            params.put("page", page);
        }

        long count = this.reservationService.countReservations(params);
        int pageSize = 6;
        model.addAttribute("pages", Math.ceil(count * 1.0 / pageSize));
        model.addAttribute("reservations", this.reservationService.getReservations(params));
        model.addAttribute("status", status);
        model.addAttribute("currentPage", page != null ? Integer.parseInt(page) : 1);
        return "manage-reservation";
    }

    @GetMapping("/tables")
    public String tablesView(Model model,
            @RequestParam(value = "page", required = false) String page) {
        Map<String, String> params = new java.util.HashMap<>();
        params.put("active", "true");
        if (page != null && !page.isEmpty()) {
            params.put("page", page);
        }

        long count = this.tableService.countTables(params);
        int pageSize = 12;
        model.addAttribute("pages", Math.ceil(count * 1.0 / pageSize));
        model.addAttribute("tables", this.tableService.getTables(params));
        model.addAttribute("currentPage", page != null ? Integer.parseInt(page) : 1);

        // Check trạng thái bàn (có khách hay trống)
        Map<Integer, Boolean> tableStatus = new java.util.HashMap<>();
        Date now = new Date();
        Date twoHoursLater = new Date(System.currentTimeMillis() + 2 * 60 * 60 * 1000);

        for (com.ccc.dto.TableDto table : this.tableService.getTables(params)) {
            boolean hasCustomer = this.reservationRepository.hasTimeConflict(
                    table.getId(), now, twoHoursLater, null);
            tableStatus.put(table.getId(), hasCustomer);
        }
        model.addAttribute("tableStatus", tableStatus);

        return "manage-table";
    }

    @DeleteMapping("/users/{id}")
    @ResponseBody
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable(value = "id") int id) {
        this.userService.deleteUser(id);
    }

    @PostMapping("/users/{userId}/approve")
    public String approveUser(@PathVariable("userId") int userId) {
        this.userService.approveUser(userId);
        return "redirect:/admin/users";
    }

    @PostMapping("/reservations/{reservationId}/cancel")
    public String cancelReservation(@PathVariable("reservationId") int reservationId) {
        this.reservationService.deleteReservation(reservationId);
        return "redirect:/admin/reservations";
    }

    @PostMapping("/reservations/{reservationId}/complete")
    public String completeReservation(@PathVariable("reservationId") int reservationId) {
        this.reservationService.updateReservation(reservationId, Map.of("status", "COMPLETED"));
        return "redirect:/admin/reservations";
    }

    @PostMapping("/walk-in")
    public String createWalkIn(@RequestParam Map<String, String> params) {
        this.reservationService.createWalkInReservation(params);
        return "redirect:/admin/tables";
    }

    @GetMapping("/available-tables")
    @ResponseBody
    public List<com.ccc.dto.TableDto> getAvailableTables(@RequestParam String startTime, @RequestParam String endTime) {
        return this.reservationService.getAvailableTables(startTime, endTime);
    }
}
