package com.blooddonor.controller;

import com.blooddonor.model.Donor;
import com.blooddonor.service.DonorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/donors")
@CrossOrigin(origins = "*") // allows frontend to call backend
public class DonorController {

    @Autowired
    private DonorService donorService;

    // GET /api/donors/search?bloodGroup=A+&city=Noida
    @GetMapping("/search")
    public ResponseEntity<List<Donor>> searchDonors(
            @RequestParam String bloodGroup,
            @RequestParam String city) {
        List<Donor> donors = donorService.searchDonors(bloodGroup, city);
        return ResponseEntity.ok(donors);
    }

    // POST /api/donors/register
    @PostMapping("/register")
    public ResponseEntity<Donor> registerDonor(@RequestBody Donor donor) {
        Donor saved = donorService.registerDonor(donor);
        return ResponseEntity.ok(saved);
    }

    // PUT /api/donors/1/toggle
    @PutMapping("/{id}/toggle")
    public ResponseEntity<Donor> toggleAvailability(@PathVariable Long id) {
        Donor updated = donorService.toggleAvailability(id);
        return ResponseEntity.ok(updated);
    }

    // PUT /api/donors/1/donated?date=2024-01-15
    @PutMapping("/{id}/donated")
    public ResponseEntity<Donor> markDonated(
            @PathVariable Long id,
            @RequestParam String date) {
        Donor updated = donorService.updateLastDonatedDate(id, LocalDate.parse(date));
        return ResponseEntity.ok(updated);
    }

    // GET /api/donors/all
    @GetMapping("/all")
    public ResponseEntity<List<Donor>> getAllDonors() {
        return ResponseEntity.ok(donorService.getAllDonors());
    }

    // DELETE /api/donors/1
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDonor(@PathVariable Long id) {
        donorService.deleteDonor(id);
        return ResponseEntity.ok("Donor deleted successfully");
    }
}
