# MatraCare AI – Progress Document

## Project Title
MatraCare AI: Real-Time Maternal Risk Prediction and Decision Support System

---

## Problem Understanding
- Identified maternal mortality as a major issue due to delayed detection of high-risk pregnancies  
- Focused on lack of real-time decision support in low-resource environments  
- Defined need for early risk prediction and actionable guidance  

---

## Idea Finalization
- Selected maternal risk prediction as the core problem  
- Defined system as a decision-support tool (not a diagnostic system)  
- Finalized key inputs:
  - Age  
  - Blood pressure  
  - Blood sugar  
  - Symptoms  
  - Pregnancy history  

---

## UI/UX Development
- Built frontend using React (Vite)  
- Designed and implemented:
  - Home screen  
  - Input form for maternal data  
  - Result screen displaying risk level and score  

- Added visual elements:
  - Risk score display  
  - Color-coded risk indicators (Low / Medium / High)  
  - Card-based layout for better readability  

- Improved UI with:
  - Interactive elements and transitions  
  - Responsive design for usability  

---

## Feature Implementation

### Completed Features
- User input form for maternal health data  
- Risk classification (Low / Medium / High)  
- Risk score generation  
- Visual representation of results  
- Basic UI interactions  

### In Progress
- Explanation of risk factors  
- Recommendation system for next steps  
- Backend/API integration  

---

## Backend & Logic Development
- Planned backend using Flask / FastAPI  
- Designed API structure for:
  - Input handling  
  - Risk calculation  
  - Output generation  

- Implemented initial rule-based logic:
  - High blood pressure increases risk  
  - High blood sugar increases risk  
  - Previous complications increase risk  

---

## Integration Status
- Frontend completed and deployed locally  
- Backend integration in progress  
- Data flow defined:
  - User Input → API → Risk Logic → Output  

---

## Repository Setup
- Project uploaded to GitHub repository  
- Organized structure with:
  - README.md  
  - progress.md  
  - src and public folders  
- Removed unnecessary files (node_modules, dist)  
- Added .gitignore for proper project management  

---

## Current Status
- Functional frontend prototype completed  
- Core features implemented  
- Project successfully uploaded and structured  
- Backend and advanced features under development  

---

## Next Steps
- Complete backend integration  
- Implement explanation and recommendation features  
- Test with multiple scenarios  
- Optimize UI and performance  
- Prepare final demo  

---

## Challenges Faced
- Designing effective risk logic within limited time  
- Managing project size and dependencies  
- Ensuring clean project structure for submission  
- Balancing UI design with functionality  

---

## Summary
The project has progressed from initial idea validation to a working frontend prototype with core functionality. The repository has been structured and uploaded successfully. The current focus is on completing backend integration and enhancing decision-support capabilities.
