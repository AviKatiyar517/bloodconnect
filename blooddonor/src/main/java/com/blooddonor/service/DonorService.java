package com.blooddonor.service;

import com.blooddonor.model.Donor;
import com.blooddonor.repository.DonorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class DonorService {

    @Autowired
    private DonorRepository donorRepository;

    // Search donors - applies 90 day cooldown rule automatically
    public List<Donor> searchDonors(String bloodGroup, String city) {
        // Safe date = today minus 90 days
        // Donors who donated after this date are hidden
        LocalDate safeDate = LocalDate.now().minusDays(90);
        return donorRepository.findSafeDonors(bloodGroup, city, safeDate);
    }

    // Register a new donor
    public Donor registerDonor(Donor donor) {
        // Validation: phone must be 10 digits
        if (donor.getPhone() == null || donor.getPhone().length() != 10) {
            throw new RuntimeException("Phone number must be exactly 10 digits");
        }
        // Validation: name must not be empty
        if (donor.getName() == null || donor.getName().trim().isEmpty()) {
            throw new RuntimeException("Name cannot be empty");
        }
        return donorRepository.save(donor);
    }

    // Toggle availability (donor can mark themselves on/off)
    public Donor toggleAvailability(Long id) {
        Optional<Donor> optional = donorRepository.findById(id);
        if (optional.isEmpty()) {
            throw new RuntimeException("Donor not found with id: " + id);
        }
        Donor donor = optional.get();
        donor.setAvailable(!donor.isAvailable());
        return donorRepository.save(donor);
    }

    // Update last donated date
    public Donor updateLastDonatedDate(Long id, LocalDate date) {
        Optional<Donor> optional = donorRepository.findById(id);
        if (optional.isEmpty()) {
            throw new RuntimeException("Donor not found with id: " + id);
        }
        Donor donor = optional.get();
        donor.setLastDonatedDate(date);
        donor.setAvailable(false); // auto mark unavailable after donating
        return donorRepository.save(donor);
    }

    // Get all donors (for admin)
    public List<Donor> getAllDonors() {
        return donorRepository.findAll();
    }

    // Delete a donor
    public void deleteDonor(Long id) {
        if (!donorRepository.existsById(id)) {
            throw new RuntimeException("Donor not found with id: " + id);
        }
        donorRepository.deleteById(id);
    }
}
