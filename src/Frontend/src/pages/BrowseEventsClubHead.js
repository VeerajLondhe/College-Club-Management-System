import React, { useState, useEffect } from "react";
import { eventService } from "../services/eventService";
import { useAuth } from "../contexts/AuthContext";

const BrowseEventsClubHead = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClub, setSelectedClub] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, selectedClub, selectedType]);

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const response = await eventService.getAvailableEventsStudent();

      const transformedEvents = response.data.map((event, index) => {
        const transformedEvent = {
          id: event.eventId,
          title: event.description || `Event ${event.eventId}`,
          date: new Date().toISOString().split("T")[0], 
          description: event.description || "No description available",
          
        };

       
        return transformedEvent;
      });

      setEvents(transformedEvents);
      
    } catch (error) {
      console.error("Error fetching events:", error);

      let errorMessage = "Failed to load events.";
      if (error.code === "ERR_NETWORK") {
        errorMessage =
          "Cannot connect to Student Service. Please check if it's running on port 7173.";
      } else if (error.response?.status === 500) {
        errorMessage = "Server error while fetching events.";
      }

      alert(errorMessage + " Please check console for details.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClub = selectedClub === "" || event.club === selectedClub;
      const matchesType = selectedType === "" || event.type === selectedType;

      return matchesSearch && matchesClub && matchesType;
    });

    setFilteredEvents(filtered);
  };

  const getUniqueClubs = () => {
    return [...new Set(events.map((event) => event.club))];
  };

  const getUniqueTypes = () => {
    return [...new Set(events.map((event) => event.type))];
  };

  const getTypeColor = (type) => {
    const colors = {
      Workshop: { backgroundColor: "#e3f2fd", color: "#1976d2" },
      Competition: { backgroundColor: "#fff3e0", color: "#f57c00" },
      Service: { backgroundColor: "#e8f5e8", color: "#2e7d32" },
      Entertainment: { backgroundColor: "#fce4ec", color: "#c2185b" },
      Social: { backgroundColor: "#f3e5f5", color: "#7b1fa2" },
    };
    return colors[type] || { backgroundColor: "#e2e3e5", color: "#6c757d" };
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ color: "#2c3e50", marginBottom: "0.5rem" }}>
          Browse All Events
        </h1>
        <p style={{ color: "#7f8c8d" }}>
          View all events happening across different clubs in the college
        </p>
      </div>


      

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <h3 style={{ color: "#7f8c8d", marginBottom: "1rem" }}>
            No Events Found
          </h3>
          <p style={{ color: "#7f8c8d" }}>
            {searchTerm || selectedClub || selectedType
              ? "Try adjusting your search criteria to find more events."
              : "No events are currently available."}
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
            gap: "2rem",
          }}
        >
          {filteredEvents.map((event) => (
            <div key={event.id} className="card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "1rem",
                }}
              >
                <h3 style={{ color: "#2c3e50", margin: 0, flex: 1 }}>
                  {event.title}
                </h3>
                
              </div>

              {event.banner && (
                <div style={{ marginBottom: "1rem" }}>
                  <img 
                    src={event.banner} 
                    alt="Event Banner" 
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "1px solid #dee2e6"
                    }}
                  />
                </div>
              )}

              <p
                style={{
                  color: "#7f8c8d",
                  marginBottom: "1rem",
                  lineHeight: "1.4",
                }}
              >
                {event.description}
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                  marginBottom: "1.5rem",
                  fontSize: "0.9rem",
                }}
              >
                <div>
                  <strong style={{ color: "#2c3e50" }}>Club:</strong>
                  <div style={{ color: "#7f8c8d" }}>{event.club}</div>
                </div>
                
                
                
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid #eee",
                }}
              >
                
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseEventsClubHead;
