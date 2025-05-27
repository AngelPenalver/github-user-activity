const formatUserEvents = (events) => {
  const eventMap = new Map();

  events.forEach((event) => {
    const repoName = event.name;
    const eventKey = `${repoName}-${event.type}`;

    if (event.type === "PushEvent") {
      const existing = eventMap.get(eventKey) || {
        name: repoName,
        type: event.type,
        value: 0,
      };
      eventMap.set(eventKey, {
        ...existing,
        value: existing.value + 1,
      });
    } else {
      if (!eventMap.has(eventKey)) {
        eventMap.set(eventKey, {
          name: repoName,
          type: event.type,
        });
      }
    }
  });

  return eventMap;
};

const sendFormattedEvents = (events) => {
  const aggregateEvents = formatUserEvents(events);
  return Array.from(aggregateEvents.values());
};

module.exports = {
  sendFormattedEvents,
};
