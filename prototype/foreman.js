function getReport() {

  try {

    return JSON.parse(
      localStorage.getItem(
        "jordanPrototypeReport"
      ) || "{}"
    );

  } catch {

    return {};

  }

}


function saveReport(report) {

  const value =
    JSON.stringify(report);

  localStorage.setItem(
    "jordanPrototypeReport",
    value
  );

  sessionStorage.setItem(
    "jordanPrototypeReport",
    value
  );

}


const report =
  getReport();


const activeIncidentSection =
  document.querySelector(
    "#activeIncidentSection"
  );

const noActiveIncident =
  document.querySelector(
    "#noActiveIncident"
  );

const activeAlertCount =
  document.querySelector(
    "#activeAlertCount"
  );

const activeAlertMetricText =
  document.querySelector(
    "#activeAlertMetricText"
  );

const acknowledgementMetric =
  document.querySelector(
    "#acknowledgementMetric"
  );

const incidentHazard =
  document.querySelector(
    "#incidentHazard"
  );

const incidentTime =
  document.querySelector(
    "#incidentTime"
  );

const incidentNote =
  document.querySelector(
    "#incidentNote"
  );

const incidentWorkZone =
  document.querySelector(
    "#incidentWorkZone"
  );

const incidentCrew =
  document.querySelector(
    "#incidentCrew"
  );

const incidentStatus =
  document.querySelector(
    ".status-active"
  );

const incidentAckStatus =
  document.querySelector(
    "#incidentAckStatus"
  );

const ackProgressLabel =
  document.querySelector(
    "#ackProgressLabel"
  );

const ackFill =
  document.querySelector(
    "#ackFill"
  );

const reportListHazard =
  document.querySelector(
    "#reportListHazard"
  );

const reportListTime =
  document.querySelector(
    "#reportListTime"
  );

const openIncidentButton =
  document.querySelector(
    "#openIncidentButton"
  );

const markCrewBriefedButton =
  document.querySelector(
    "#markCrewBriefedButton"
  );

const incidentsNavButton =
  document.querySelector(
    "#incidentsNavButton"
  );

const crewStatuses =
  document.querySelectorAll(
    ".crew-status"
  );

const firstReportRow =
  document.querySelector(
    ".report-row.active-report"
  );

const liveIncidentPill =
  document.querySelector(
    ".live-incident-pill"
  );


/* =========================================
   INCIDENT STATE
   ========================================= */

const resolved =
  report.resolved === true ||
  report.status === "Resolved";


const monitoring =
  report.status === "Monitoring";


const active =
  Boolean(report.id) &&
  report.urgency === "active" &&
  !resolved;


/* =========================================
   ACTIVE / EMPTY STATE
   ========================================= */

if (active) {

  activeIncidentSection.style.display =
    "block";


  noActiveIncident.style.display =
    "none";


  activeAlertCount.textContent =
    "1";


  if (monitoring) {

    activeAlertMetricText.textContent =
      "Incident under monitoring";

  } else {

    activeAlertMetricText.textContent =
      "Requires supervisor attention";

  }

} else {

  activeIncidentSection.style.display =
    "none";


  noActiveIncident.style.display =
    "grid";


  activeAlertCount.textContent =
    "0";


  activeAlertMetricText.textContent =
    "No unresolved live alerts";

}


/* =========================================
   INCIDENT CONTENT
   ========================================= */

if (report.id) {

  if (reportListHazard) {

    reportListHazard.textContent =
      report.hazard ||
      "Safety Hazard";

  }


  if (report.timestamp) {

    const formattedTime =
      new Intl.DateTimeFormat(
        "en-US",
        {
          hour: "numeric",
          minute: "2-digit"
        }
      ).format(
        new Date(
          report.timestamp
        )
      );


    if (reportListTime) {

      reportListTime.textContent =
        formattedTime;

    }


    if (incidentTime) {

      incidentTime.textContent =
        formattedTime;

    }

  }


  if (incidentHazard) {

    incidentHazard.textContent =
      report.hazard ||
      "Safety Hazard";

  }


  if (incidentWorkZone) {

    incidentWorkZone.textContent =
      report.workZone ||
      "I-70 Eastbound";

  }


  if (incidentCrew) {

    incidentCrew.textContent =
      report.crew ||
      "Crew A";

  }


  if (incidentNote) {

    incidentNote.textContent =
      report.note ||
      "No additional reporter note.";

  }

}


/* =========================================
   INCIDENT STATUS DISPLAY
   ========================================= */

if (incidentStatus) {

  if (resolved) {

    incidentStatus.textContent =
      "Resolved";


    incidentStatus.style.color =
      "#2f855a";

  } else if (monitoring) {

    incidentStatus.textContent =
      "Monitoring";


    incidentStatus.style.color =
      "#b7791f";

  } else {

    incidentStatus.textContent =
      "Active";


    incidentStatus.style.color =
      "#d95400";

  }

}


/* =========================================
   INCIDENT BADGE
   ========================================= */

if (liveIncidentPill) {

  if (monitoring) {

    liveIncidentPill.innerHTML =
      `
        <span></span>
        MONITORING
      `;


    liveIncidentPill.style.color =
      "#9a650f";


    liveIncidentPill.style.background =
      "#fff7db";


    liveIncidentPill.style.borderColor =
      "#ead39a";

  } else {

    liveIncidentPill.innerHTML =
      `
        <span></span>
        LIVE
      `;

  }

}


/* =========================================
   CREW ACKNOWLEDGEMENT
   ========================================= */

/*
 * Only real prototype actions count.
 *
 * No one has acknowledged:
 * 0 / 6
 *
 * Kay acknowledges the worker alert:
 * 1 / 6
 *
 * Foreman marks the entire crew briefed:
 * 6 / 6
 */

let acknowledgedCount =
  report.crewBriefed === true
    ? 6
    : (
        report.acknowledged === true
          ? 1
          : 0
      );


const totalCrew =
  6;


function renderCrewState() {

  const percent =
    Math.round(
      (
        acknowledgedCount /
        totalCrew
      ) * 100
    );


  if (acknowledgementMetric) {

    acknowledgementMetric.textContent =
      `${acknowledgedCount} / ${totalCrew}`;

  }


  if (incidentAckStatus) {

    incidentAckStatus.textContent =
      `${acknowledgedCount} of ${totalCrew} acknowledged`;

  }


  if (ackProgressLabel) {

    ackProgressLabel.textContent =
      `${percent}%`;

  }


  if (ackFill) {

    ackFill.style.width =
      `${percent}%`;

  }


  /*
   * Kay Thomas is the only real worker
   * operating in this prototype.
   *
   * Until the foreman manually briefs
   * the full crew, only Kay should be
   * shown as acknowledged.
   */

  crewStatuses.forEach(
    (status, index) => {

      let shouldAcknowledge =
        false;


      if (
        report.crewBriefed === true
      ) {

        shouldAcknowledge =
          true;

      } else if (
        report.acknowledged === true &&
        index === 0
      ) {

        shouldAcknowledge =
          true;

      }


      if (shouldAcknowledge) {

        status.textContent =
          "Acknowledged";


        status.classList.remove(
          "pending"
        );


        status.classList.add(
          "acknowledged"
        );

      } else {

        status.textContent =
          "Pending";


        status.classList.remove(
          "acknowledged"
        );


        status.classList.add(
          "pending"
        );

      }

    }
  );


  if (
    markCrewBriefedButton
  ) {

    if (
      report.crewBriefed === true
    ) {

      markCrewBriefedButton.textContent =
        "Crew Briefed ✓";


      markCrewBriefedButton.disabled =
        true;

    } else {

      markCrewBriefedButton.textContent =
        "Mark Crew Briefed";


      markCrewBriefedButton.disabled =
        false;

    }

  }

}


renderCrewState();


/* =========================================
   TODAY REPORT ROW
   ========================================= */

function renderLatestReportRow() {

  if (
    !report.id ||
    !firstReportRow
  ) {

    return;

  }


  const icon =
    firstReportRow.querySelector(
      ".report-state-icon"
    );


  const description =
    firstReportRow.querySelector(
      ".report-row-copy p"
    );


  const status =
    firstReportRow.querySelector(
      ".report-status"
    );


  if (
    !icon ||
    !description ||
    !status
  ) {

    return;

  }


  icon.classList.remove(
    "monitoring",
    "resolved"
  );


  status.classList.remove(
    "active",
    "monitoring",
    "resolved"
  );


  /* =========================================
     RESOLVED
     ========================================= */

  if (resolved) {

    icon.textContent =
      "✓";


    icon.classList.add(
      "resolved"
    );


    status.textContent =
      "RESOLVED";


    status.classList.add(
      "resolved"
    );


    if (
      report.supervisorAction &&
      report.supervisorNote
    ) {

      description.textContent =
        `${report.supervisorAction}. ${report.supervisorNote}`;

    } else if (
      report.supervisorAction
    ) {

      description.textContent =
        `Supervisor response: ${report.supervisorAction}`;

    } else if (
      report.supervisorNote
    ) {

      description.textContent =
        report.supervisorNote;

    } else {

      description.textContent =
        "Incident resolved";

    }


    return;

  }


  /* =========================================
     MONITORING
     ========================================= */

  if (monitoring) {

    icon.textContent =
      "!";


    icon.classList.add(
      "monitoring"
    );


    status.textContent =
      "MONITORING";


    status.classList.add(
      "monitoring"
    );


    if (
      report.supervisorAction &&
      report.supervisorNote
    ) {

      description.textContent =
        `${report.supervisorAction}. ${report.supervisorNote}`;

    } else if (
      report.supervisorAction
    ) {

      description.textContent =
        `Supervisor response: ${report.supervisorAction}`;

    } else if (
      report.supervisorNote
    ) {

      description.textContent =
        report.supervisorNote;

    } else {

      description.textContent =
        "Incident remains under monitoring";

    }


    return;

  }


  /* =========================================
     DOCUMENTED
     ========================================= */

  if (
    report.urgency ===
    "document"
  ) {

    icon.textContent =
      "✓";


    icon.classList.add(
      "resolved"
    );


    status.textContent =
      "DOCUMENTED";


    status.classList.add(
      "resolved"
    );


    description.textContent =
      report.note ||
      "Documented safety report";


    return;

  }


  /* =========================================
     ACTIVE
     ========================================= */

  icon.textContent =
    "!";


  status.textContent =
    "ACTIVE";


  status.classList.add(
    "active"
  );


  description.textContent =
    report.note ||
    "Active crew alert";

}


renderLatestReportRow();


/* =========================================
   MARK CREW BRIEFED
   ========================================= */

if (markCrewBriefedButton) {

  markCrewBriefedButton.addEventListener(
    "click",
    () => {

      const currentReport =
        getReport();


      currentReport.crewBriefed =
        true;


      currentReport.crewBriefedAt =
        new Date().toISOString();


      saveReport(
        currentReport
      );


      window.location.reload();

    }
  );

}


/* =========================================
   OPEN INCIDENT
   ========================================= */

if (openIncidentButton) {

  openIncidentButton.addEventListener(
    "click",
    () => {

      window.location.href =
        "foreman-incident.html";

    }
  );

}


/* =========================================
   INCIDENT NAVIGATION
   ========================================= */

if (incidentsNavButton) {

  incidentsNavButton.addEventListener(
    "click",
    () => {

      if (active) {

        activeIncidentSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      } else {

        noActiveIncident.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }

    }
  );

}