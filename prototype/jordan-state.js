const JordanState = (() => {
  const REPORT_KEY = "jordanPrototypeReport";

  function getReport() {
    try {
      return JSON.parse(
        localStorage.getItem(REPORT_KEY) || "{}"
      );
    } catch (error) {
      console.error("Unable to read JORDAN report state:", error);
      return {};
    }
  }

  function saveReport(report) {
    const value = JSON.stringify(report);

    localStorage.setItem(
      REPORT_KEY,
      value
    );

    return report;
  }

  function updateReport(updates) {
    const current = getReport();

    const next = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return saveReport(next);
  }

  function createReport(data) {
    const now = new Date().toISOString();

    const report = {
      id:
        data.id ||
        `jordan-${Date.now()}`,

      hazard:
        data.hazard ||
        "Safety Hazard",

      urgency:
        data.urgency ||
        "document",

      note:
        data.note ||
        "",

      photoAttached:
        data.photoAttached === true,

      project:
        data.project ||
        "24-117",

      workZone:
        data.workZone ||
        "I-70 Eastbound",

      crew:
        data.crew ||
        "Crew A",

      location:
        data.location ||
        "Work-zone GPS",

      reporter:
        data.reporter ||
        "Kay Thomas",

      timestamp:
        data.timestamp ||
        now,

      status:
        data.status ||
        (
          data.urgency === "active"
            ? "Active"
            : "Reported"
        ),

      acknowledged:
        false,

      acknowledgedAt:
        null,

      acknowledgedBy: [],

      crewBriefed:
        false,

      crewBriefedAt:
        null,

      supervisorAction:
        null,

      supervisorNote:
        "",

      supervisorUpdatedAt:
        null,

      resolved:
        false,

      resolvedAt:
        null,

      createdAt:
        now,

      updatedAt:
        now
    };

    return saveReport(report);
  }

  function acknowledgeWorker(workerName = "Kay Thomas") {
    const report = getReport();

    if (!report.id) {
      return report;
    }

    const acknowledgedBy =
      Array.isArray(report.acknowledgedBy)
        ? [...report.acknowledgedBy]
        : [];

    if (!acknowledgedBy.includes(workerName)) {
      acknowledgedBy.push(workerName);
    }

    return updateReport({
      acknowledged: true,
      acknowledgedAt:
        report.acknowledgedAt ||
        new Date().toISOString(),
      acknowledgedBy
    });
  }

  function markCrewBriefed() {
    return updateReport({
      crewBriefed: true,
      crewBriefedAt:
        new Date().toISOString()
    });
  }

  function setSupervisorAction(action, note = "") {
    return updateReport({
      supervisorAction: action,
      supervisorNote: note
    });
  }

  function setMonitoring(action, note = "") {
    return updateReport({
      status: "Monitoring",
      resolved: false,
      supervisorAction: action,
      supervisorNote: note
    });
  }

  function resolveIncident(action, note = "") {
    const now = new Date().toISOString();

    return updateReport({
      status: "Resolved",
      resolved: true,
      resolvedAt: now,
      supervisorAction: action,
      supervisorNote: note
    });
  }

  function clearReport() {
    localStorage.removeItem(
      REPORT_KEY
    );
  }

  function getAcknowledgedCount(totalCrew = 6) {
    const report = getReport();

    if (!report.id) {
      return 0;
    }

    if (report.crewBriefed === true) {
      return totalCrew;
    }

    if (
      Array.isArray(report.acknowledgedBy)
    ) {
      return Math.min(
        report.acknowledgedBy.length,
        totalCrew
      );
    }

    return report.acknowledged === true
      ? 1
      : 0;
  }

  return {
    getReport,
    saveReport,
    updateReport,
    createReport,
    acknowledgeWorker,
    markCrewBriefed,
    setSupervisorAction,
    setMonitoring,
    resolveIncident,
    clearReport,
    getAcknowledgedCount
  };
})();
