import React, { useState, useEffect } from "react";
import { eventService } from "../../services/eventService";
import { useAuth } from "../../contexts/AuthContext";

const BrowseEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClub, setSelectedClub] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [loading, setLoading] = useState(true);
  const [userEvents, setUserEvents] = useState(new Set());

  useEffect(() => {
    fetchEvents();
    fetchUserEvents();
  }, []);

  useEffect(() => {
    filterEvents();
    
  }, [events, searchTerm, selectedClub, selectedType]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      console.log("Fetching available events from Student Service...");

      const response = await eventService.getAvailableEventsStudent();
      console.log("Student Service events response:", response.data);

      const transformedEvents = response.data.map((event, index) => {
        const transformedEvent = {
          id: event.eventId,
          title: event.description || `Event ${event.eventId}`,
          club: event.clubName || "Unknown Club",
          date: new Date().toISOString().split("T")[0], 
          time: "TBD",
          location: "TBD",
          type: "General",
          description: event.description || "No description available",
          capacity: 100,
          registered: 0, 
          banner: event.bannerBase64
        };

        console.log(
          `Transformed event ${index + 1} for browsing:`,
          transformedEvent
        );
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

  const fetchUserEvents = async () => {
    try {
      if (user?.uid) {
        console.log('Fetching user registered events from Student Service...');
        const response = await eventService.getUserRegisteredEvents(user.uid);
        const registeredEventIds = new Set(response.data.map(event => event.eventId));
        setUserEvents(registeredEventIds);
        console.log('User registered events:', registeredEventIds);
      }
    } catch (error) {
      console.error("Error fetching user events:", error);
      setUserEvents(new Set());
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

  const handleJoinEvent = async (eventId) => {
    try {
      console.log('Registering for event:', eventId);
      await eventService.registerForEventStudent(eventId, user.uid);
      
      setUserEvents((prev) => new Set([...prev, eventId]));
      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventId
            ? { ...event, registered: event.registered + 1 }
            : event
        )
      );
      
      alert('Successfully registered for the event!');
    } catch (error) {
      console.error('Error registering for event:', error);
      alert('Failed to register for event. Please try again.');
    }
  };

  const handleLeaveEvent = async (eventId) => {
    try {
      console.log('Unregistering from event:', eventId);
      await eventService.unregisterFromEventStudent(eventId, user.uid);
      
      setUserEvents((prev) => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventId
            ? { ...event, registered: Math.max(0, event.registered - 1) }
            : event
        )
      );
      
      alert('Successfully unregistered from the event.');
    } catch (error) {
      alert('Failed to unregister from event. Please try again.');
    }
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
          Browse Events
        </h1>
        <p style={{ color: "#7f8c8d" }}>
          Discover and join exciting events from various clubs
        </p>
      </div>

      

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
          {filteredEvents.map((event) => {
            const isRegistered = userEvents.includes(event.id);
            const isFull = event.registered >= event.capacity;

            return (
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
                  {isRegistered ? (
                    <button
                      className="btn btn-danger"
                      style={{ fontSize: "0.9rem" }}
                      onClick={() => handleLeaveEvent(event.id)}
                    >
                      Leave Event
                    </button>
                  ) : (
                    <button
                      className={`btn ${
                        isFull ? "btn-secondary" : "btn-success"
                      }`}
                      style={{ fontSize: "0.9rem" }}
                      disabled={isFull}
                      onClick={() => !isFull && handleJoinEvent(event.id)}
                    >
                      {isFull ? "Full" : "Join Event"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BrowseEvents;
