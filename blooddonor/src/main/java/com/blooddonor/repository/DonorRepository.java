package com.blooddonor.repository;

import com.blooddonor.model.Donor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DonorRepository extends JpaRepository<Donor, Long> {

    // Our UNIQUE feature:
    // Only return donors who are:
    // 1. Available
    // 2. Match blood group and city
    // 3. Have NOT donated in the last 90 days (safe donation gap)
    @Query("SELECT d FROM Donor d WHERE " +
           "d.bloodGroup = :bloodGroup AND " +
           "LOWER(d.city) = LOWER(:city) AND " +
           "d.available = true AND " +
           "(d.lastDonatedDate IS NULL OR d.lastDonatedDate <= :safeDate)")
    List<Donor> findSafeDonors(
        @Param("bloodGroup") String bloodGroup,
        @Param("city") String city,
        @Param("safeDate") LocalDate safeDate
    );
}
