package com.placement.dto;

import com.placement.entity.ApplicationStatus;
import jakarta.validation.constraints.NotNull;

public class ApplicationStatusUpdate {

    @NotNull(message = "Status is required")
    private ApplicationStatus status;

    private String feedback;

    public ApplicationStatusUpdate() {
    }

    public ApplicationStatusUpdate(ApplicationStatus status, String feedback) {
        this.status = status;
        this.feedback = feedback;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }
}
