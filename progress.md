# MatraCare AI – Progress Document

## Project Title
MatraCare AI: Real-Time Maternal Risk Prediction and Decision Support System

---

## Problem Understanding
- Identified maternal mortality as a key issue due to delayed risk detection  
- Focused on decision-making gaps in low-resource environments  
- Defined need for real-time risk prediction and actionable guidance  

---

## Idea Finalization
- Selected maternal risk prediction as the core problem  
- Defined system as a decision-support tool (not diagnostic)  
- Finalized key inputs:
  - Age  
  - Blood pressure  
  - Blood sugar  
  - Symptoms  
  - Pregnancy history  

---

## Feature Planning
Planned core features:
- Risk prediction (Low / Medium / High)  
- Risk score (0–100)  
- Explanation of risk factors  
- Action recommendations  

Planned advanced features:
- Risk trend tracking  
- What-if scenario simulation  
- Smart action timeline  
- Emergency alert system  

---

## UI/UX Design Progress
- Designed initial UI screens in Figma:
  - Home screen  
  - Input form  
  - Result screen  
- Added:
  - Risk score visualization  
  - Color-coded risk indicators  
- Improved UI with:
  - Micro-interactions  
  - Smooth transitions  
  - Clean layout for better usability  

---

## Backend Development Progress
- Set up backend environment (Flask/FastAPI)  
- Defined API structure for:
  - Input handling  
  - Risk calculation  
  - Output generation  

---

## Risk Logic Development
- Implemented initial rule-based logic:
  - High BP → increase risk  
  - High sugar → increase risk  
  - Previous complications → increase risk  
- Designed scoring system (0–100)  
- Mapping score to risk levels:
  - Low  
  - Medium  
  - High  

---

## Integration Progress
- Planning integration between frontend and backend  
- Preparing data flow:
  - User input → API → Risk logic → Output  

---

## Current Status
- UI design completed  
- Backend setup in progress  
- Core logic in development  
- Integration in progress  

---

## Next Steps
- Complete frontend-backend integration  
- Test multiple risk scenarios  
- Add explanation and recommendation system  
- Improve UI responsiveness  
- Prepare final demo  

---

## Challenges Faced
- Designing realistic but simple risk logic  
- Balancing simplicity and impact for hackathon timeline  
- Ensuring UI remains clean while adding features  

---

## Summary
The project has progressed from idea validation to design and initial development. The focus is now on completing integration and delivering a functional prototype with clear decision-support capabilities.
