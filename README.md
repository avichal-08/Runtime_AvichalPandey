# Kalpathon Hackathon Submission

## Team Name  
**Runtime**

---

## Project Name  
**Eventra**

---

## Selected Track  
**Web Development**

---

## Selected Problem Statement (PS)  
**Hyper-Local Event Ticketing Startup**

---

## Team Leader  
**Name:** Avichal Pandey  
**Phone:** 9695284168  

---

## Team Members & Roles  

| Name | Role |
|------|------|
| Avichal Pandey | Full Stack Developer |
| Ayush Mishra | Frontend Developer |
| Prince Kumar | Frontend Developer |

---

## Project Description  

### **Problem**  
Existing ticketing platforms are designed for large-scale events and enterprise use cases. They are often too complex, expensive, and inefficient for hyper-local events such as college fests, community meetups, and small-scale gatherings.

Ticket booking systems often fail under high demand. Users experience issues like double bookings, overselling, and server crashes due to concurrent requests hitting the system simultaneously. This leads to an unreliable and unfair booking experience, especially for hyper-local events where demand spikes are unpredictable.

---

### **Solution**  
Eventra introduces a queue-based ticketing system that ensures controlled and fair booking under high demand. Instead of processing all requests directly, booking requests are routed through a queue and processed sequentially. This eliminates race conditions and guarantees consistency.  

The platform also provides real-time seat updates using WebSockets, ensuring users always see accurate availability.

---

### **Key Features**  

- **Queue-Based Booking System**  
  All booking requests are processed via BullMQ, preventing race conditions and ensuring fair allocation.

- **Real-Time Seat Updates**  
  WebSocket-based updates allow users to see seat availability change instantly across all clients.

- **Overbooking Prevention**  
  Sequential job processing ensures that available seats never go below zero.

- **QR-Based Ticketing**  
  Each booking generates a unique QR code for seamless event entry and verification.

- **High-Demand Handling**  
  Designed to remain stable and responsive even during traffic spikes.

---

### **Tech Stack**  

- **Frontend:** Next.js, Tailwind CSS, shadcn/ui  
- **Backend:** Next.js API Routes, Express  
- **Runtime:** Bun  
- **Database:** PostgreSQL (Drizzle ORM)  
- **Queue System:** BullMQ  
- **Realtime:** WebSockets (ws)  
- **Cache & Messaging:** Redis (Upstash)  
- **Authentication:** NextAuth  

---

### **Impact**  

Eventra improves the reliability and fairness of ticket booking systems, particularly for local events where infrastructure is often limited.  

By introducing queue-based processing and real-time feedback:
- Users get a transparent and consistent booking experience  
- Event organizers avoid overselling and operational issues  
- Systems remain stable under high demand  

This approach can be extended to larger-scale ticketing platforms and other high-concurrency systems.

---

## 🔗 Additional Links (Optional)  

**Presentation:** [Add Link]  