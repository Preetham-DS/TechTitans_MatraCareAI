# MatraCare AI – Progress Document

## Project Title
MatraCare AI: Real-Time Maternal Risk Prediction and Decision Support System

---

## Problem Understanding
- Identified maternal mortality as a major issue due to delayed detection of high-risk pregnancies  
- Focused on the lack of real-time decision support in low-resource settings  
- Defined need for early risk prediction and actionable guidance  

---

## Idea Finalization
- Selected maternal risk prediction as the core problem  
- Defined the system as a decision-support tool (not a diagnostic system)  
- Finalized key input parameters:
  - Age  
  - Blood pressure  
  - Blood sugar  
  - Symptoms  
  - Pregnancy history  

---

## UI/UX Development Progress
- Developed frontend using React and Vite  
- Designed and implemented:
  - Home screen  
  - Input form for maternal data  
  - Result screen displaying risk level and score  

- Added visual elements:
  - Risk score display  
  - Color-coded risk indicators (Low / Medium / High)  
  - Card-based layout for clarity  

- Integrated charts (Recharts) for:
  - Risk visualization  
  - Data representation  

- Added interactive elements:
  - Smooth transitions and UI effects  
  - Responsive design for better usability  

---

## Feature Implementation

### Implemented Features
- Risk input form for maternal health data  
- Risk classification (Low / Medium / High)  
- Risk score generation  
- Visual representation of results  
- Basic UI interactions and transitions  

### Partially Implemented Features
- Explanation of risk factors  
- Recommendation system for next steps  
- API integration for dynamic processing  

---

## Additional Enhancements
- Integrated voice assistant module (UI level)  
- Added modular component structure for scalability  
- Used reusable components for better maintainability  

---

## Backend & Logic Progress
- Planned backend using Flask / FastAPI  
- Defined API structure for:
  - Receiving user inputs  
  - Processing risk logic  
  - Returning results  

- Initial rule-based logic designed:
  - High BP increases risk  
  - High sugar increases risk  
  - Previous complications increase risk  

---

## Integration Status
- Frontend largely completed  
- Backend integration in progress  
- Data flow being structured:
  - Input → API → Risk logic → Output  

---

## Current Status
- Frontend development completed  
- Core UI and components ready  
- Risk logic partially implemented  
- Backend and API integration in progress  

---

## Next Steps
- Complete backend development  
- Connect frontend with backend APIs  
- Implement explanation and recommendation system  
- Test different risk scenarios  
- Optimize UI and performance  
- Prepare final demo  

---

## Challenges Faced
- Designing realistic risk logic within limited time  
- Managing large project dependencies  
- Balancing UI quality with feature development  
- Ensuring smooth integration between frontend and backend  

---

## Summary
The project has progressed from initial planning to a functional frontend prototype with core features implemented. The current focus is on completing backend integration and enhancing decision-support capabilities to deliver a fully working system.
