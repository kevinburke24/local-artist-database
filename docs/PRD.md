# Local Musician PRD

### **1. Problem**

Musicians often struggle to find collaborators, promoters, or local artists to connect with. Venues also need a simple way to discover local talent.

### **2. Solution**

A simple web application where users can search by ZIP code to find artists who have submitted themselves to the database. Supports filtering by genre, name, and monthly listeners.

### **3. Users**

- Musicians
- Venues / small event organizers
- Producers looking for local collaborators
- Fans wanting to discover local creators

### **4. Core Functionality (MVP)**

- Search artists by ZIP
- Filter by:
    - First name
    - Last name
    - Genre
    - Monthly listener count (min/max)
- Artist submission form:
    - Name
    - Genre
    - ZIP code
    - Links (Spotify, YouTube)
    - Monthly listeners
    - Bio
- Artist detail page
- Clean table UI for search results
- Fully deployed backend + frontend

### **5. Out of Scope (for now)**

- Spotify API integration
- AI bio generation
- Map-based search
- Embeddings or recommendations
- User auth / login
- Profiles for venues

### **6. Success Criteria**

- Query returns artists in <200ms
- No crashes with empty ZIPs
- Frontend cleanly displays table results
- Deployed app loads in <3 seconds
- Recruiters can browse 20–40 seeded artists