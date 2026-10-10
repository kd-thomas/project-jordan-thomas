/* =========================================
   JORDAN PROTOTYPE
   FOREMAN INCIDENT CONTROLLER
   ========================================= */


/* =========================================
   STORAGE
   ========================================= */

const getReport =
  JordanState.getReport;

const saveReport =
  JordanState.saveReport;


/* =========================================
   REPORT
   ========================================= */


let report =
  getReport();


/* =========================================
   ELEMENTS
   ========================================= */

const incidentHazard =
  document.querySelector(
    "#incidentHazard"
  );


const incidentReporterNote =
  document.querySelector(
    "#incidentReporterNote"
  );


const incidentProject =
  document.querySelector(
    "#incidentProject"
  );


const incidentWorkZone =
  document.querySelector(
    "#incidentWorkZone"
  );


const incidentCrew =
  document.querySelector(
    "#incidentCrew"
  );


const incidentReportedTime =
  document.querySelector(
    "#incidentReportedTime"
  );


const incidentAcknowledgedCount =
  document.querySelector(
    "#incidentAcknowledgedCount"
  );


const incidentAckFill =
  document.querySelector(
    "#incidentAckFill"
  );


const briefCrewButton =
  document.querySelector(
    "#briefCrewButton"
  );


const supervisorActions =
  document.querySelectorAll(
    ".supervisor-action"
  );


const supervisorNote =
  document.querySelector(
    "#supervisorNote"
  );


const supervisorNoteCount =
  document.querySelector(
    "#supervisorNoteCount"
  );


const monitorIncidentButton =
  document.querySelector(
    "#monitorIncidentButton"
  );


const resolveIncidentButton =
  document.querySelector(
    "#resolveIncidentButton"
  );


const incidentStatusOptions =
  document.querySelectorAll(
    ".incident-status-option"
  );


const saveIncidentButton =
  document.querySelector(
    "#saveIncidentButton"
  );


const incidentSubmitHelper =
  document.querySelector(
    "#incidentSubmitHelper"
  );


const backToDashboardButton =
  document.querySelector(
    "#backToDashboardButton"
  );


const summaryLivePill =
  document.querySelector(
    ".summary-live-pill"
  );


/* =========================================
   CURRENT FORM STATE
   ========================================= */

let selectedAction =
  report.supervisorAction ||
  null;


let selectedStatus =
  report.resolved === true ||
  report.status === "Resolved"
    ? "resolved"
    : (
        report.status === "Monitoring"
          ? "monitoring"
          : null
      );


const totalCrew =
  6;


/*
 * Actual prototype behavior:
 *
 * nobody acknowledges:
 * 0 / 6
 *
 * Kay acknowledges:
 * 1 / 6
 *
 * foreman briefs entire crew:
 * 6 / 6
 */

let acknowledgedCount =
  JordanState.getAcknowledgedCount(
    totalCrew
  );


/* =========================================
   TIME FORMATTER
   ========================================= */

function formatTime(timestamp) {

  if (!timestamp) {

    return "Just now";

  }


  const date =
    new Date(timestamp);


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return "Just now";

  }


  return new Intl.DateTimeFormat(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit"
    }
  ).format(date);

}


/* =========================================
   INCIDENT SUMMARY
   ========================================= */

function renderIncidentSummary() {

  if (incidentHazard) {

    incidentHazard.textContent =
      report.hazard ||
      "Safety Hazard";

  }


  if (incidentReporterNote) {

    incidentReporterNote.textContent =
      report.note ||
      "No reporter note provided.";

  }


  if (incidentProject) {

    incidentProject.textContent =
      report.project ||
      "24-117";

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


  if (incidentReportedTime) {

    incidentReportedTime.textContent =
      formatTime(
        report.timestamp
      );

  }


  if (summaryLivePill) {

    if (
      report.status ===
      "Monitoring"
    ) {

      summaryLivePill.innerHTML =
        `
          <span></span>
          MONITORING
        `;


      summaryLivePill.style.color =
        "#9a650f";


      summaryLivePill.style.background =
        "#fff7db";


      summaryLivePill.style.borderColor =
        "#ead39a";

    } else if (
      report.status ===
      "Resolved"
    ) {

      summaryLivePill.innerHTML =
        `
          <span></span>
          RESOLVED
        `;


      summaryLivePill.style.color =
        "#2f855a";


      summaryLivePill.style.background =
        "#e8f7ef";


      summaryLivePill.style.borderColor =
        "#bde6cf";

    } else {

      summaryLivePill.innerHTML =
        `
          <span></span>
          ACTIVE
        `;

    }

  }

}


renderIncidentSummary();


/* =========================================
   CREW RESPONSE
   ========================================= */

function renderCrewResponse() {

  const percentage =
    Math.round(
      (
        acknowledgedCount /
        totalCrew
      ) * 100
    );


  if (incidentAcknowledgedCount) {

    incidentAcknowledgedCount.textContent =
      `${acknowledgedCount} / ${totalCrew}`;

  }


  if (incidentAckFill) {

    incidentAckFill.style.width =
      `${percentage}%`;

  }


  if (briefCrewButton) {

    if (
      report.crewBriefed === true
    ) {

      briefCrewButton.textContent =
        "Entire Crew Briefed ✓";


      briefCrewButton.disabled =
        true;

    } else {

      briefCrewButton.textContent =
        "Mark Entire Crew Briefed";


      briefCrewButton.disabled =
        false;

    }

  }

}


renderCrewResponse();


/* =========================================
   MARK ENTIRE CREW BRIEFED
   ========================================= */

if (briefCrewButton) {

  briefCrewButton.addEventListener(
    "click",
    () => {

      report =
        JordanState.markCrewBriefed();


      acknowledgedCount =
        JordanState.getAcknowledgedCount(
          totalCrew
        );


      renderCrewResponse();

    }
  );

}


/* =========================================
   RESTORE SAVED SUPERVISOR ACTION
   ========================================= */

function restoreSupervisorAction() {

  if (!selectedAction) {

    return;

  }


  supervisorActions.forEach(
    (button) => {

      button.classList.remove(
        "selected"
      );


      if (
        button.dataset.action ===
        selectedAction
      ) {

        button.classList.add(
          "selected"
        );

      }

    }
  );

}


restoreSupervisorAction();


/* =========================================
   SUPERVISOR ACTION SELECTION
   ========================================= */

supervisorActions.forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {

        supervisorActions.forEach(
          (item) => {

            item.classList.remove(
              "selected"
            );

          }
        );


        button.classList.add(
          "selected"
        );


        selectedAction =
          button.dataset.action;


        updateSaveState();

      }
    );

  }
);


/* =========================================
   RESTORE SUPERVISOR NOTE
   ========================================= */

function restoreSupervisorNote() {

  if (!supervisorNote) {

    return;

  }


  const savedNote =
    report.supervisorNote ||
    "";


  supervisorNote.value =
    savedNote;


  if (supervisorNoteCount) {

    supervisorNoteCount.textContent =
      `${savedNote.length} / 300`;

  }

}


restoreSupervisorNote();


/* =========================================
   NOTE CHARACTER COUNT
   ========================================= */

if (supervisorNote) {

  supervisorNote.addEventListener(
    "input",
    () => {

      if (supervisorNoteCount) {

        supervisorNoteCount.textContent =
          `${supervisorNote.value.length} / 300`;

      }

    }
  );

}


/* =========================================
   INCIDENT STATUS
   ========================================= */

function selectStatus(
  button,
  status
) {

  incidentStatusOptions.forEach(
    (item) => {

      item.classList.remove(
        "selected"
      );

    }
  );


  button.classList.add(
    "selected"
  );


  selectedStatus =
    status;


  updateSaveState();

}


/* =========================================
   RESTORE SAVED INCIDENT STATUS
   ========================================= */

function restoreIncidentStatus() {

  incidentStatusOptions.forEach(
    (item) => {

      item.classList.remove(
        "selected"
      );

    }
  );


  if (
    selectedStatus ===
      "monitoring" &&
    monitorIncidentButton
  ) {

    monitorIncidentButton.classList.add(
      "selected"
    );

  }


  if (
    selectedStatus ===
      "resolved" &&
    resolveIncidentButton
  ) {

    resolveIncidentButton.classList.add(
      "selected"
    );

  }

}


restoreIncidentStatus();


/* =========================================
   STATUS EVENTS
   ========================================= */

if (monitorIncidentButton) {

  monitorIncidentButton.addEventListener(
    "click",
    () => {

      selectStatus(
        monitorIncidentButton,
        "monitoring"
      );

    }
  );

}


if (resolveIncidentButton) {

  resolveIncidentButton.addEventListener(
    "click",
    () => {

      selectStatus(
        resolveIncidentButton,
        "resolved"
      );

    }
  );

}


/* =========================================
   SAVE BUTTON STATE
   ========================================= */

function updateSaveState() {

  if (
    !saveIncidentButton ||
    !incidentSubmitHelper
  ) {

    return;

  }


  const actionReady =
    Boolean(selectedAction);


  const statusReady =
    Boolean(selectedStatus);


  if (
    !actionReady ||
    !statusReady
  ) {

    saveIncidentButton.disabled =
      true;


    saveIncidentButton.classList.remove(
      "resolve-mode"
    );


    saveIncidentButton.textContent =
      "SAVE INCIDENT UPDATE";


    if (
      !actionReady &&
      !statusReady
    ) {

      incidentSubmitHelper.textContent =
        "Select a supervisor action and incident status.";

    } else if (!actionReady) {

      incidentSubmitHelper.textContent =
        "Select the supervisor action that was taken.";

    } else {

      incidentSubmitHelper.textContent =
        "Select whether this incident should remain active or be resolved.";

    }


    return;

  }


  saveIncidentButton.disabled =
    false;


  if (
    selectedStatus ===
    "resolved"
  ) {

    saveIncidentButton.classList.add(
      "resolve-mode"
    );


    saveIncidentButton.textContent =
      "RESOLVE INCIDENT";


    incidentSubmitHelper.textContent =
      "This will close the active crew alert and save the supervisor response.";

  } else {

    saveIncidentButton.classList.remove(
      "resolve-mode"
    );


    saveIncidentButton.textContent =
      "SAVE INCIDENT UPDATE";


    incidentSubmitHelper.textContent =
      "The incident will remain active and the supervisor response will be saved.";

  }

}


/* =========================================
   INITIAL SAVE BUTTON STATE
   ========================================= */

updateSaveState();


/* =========================================
   SAVE INCIDENT UPDATE
   ========================================= */

if (saveIncidentButton) {

  saveIncidentButton.addEventListener(
    "click",
    () => {

      if (
        !selectedAction ||
        !selectedStatus
      ) {

        return;

      }


      const note =
        supervisorNote
          ? supervisorNote.value.trim()
          : "";


      if (
        selectedStatus ===
        "resolved"
      ) {

        report =
          JordanState.resolveIncident(
            selectedAction,
            note
          );

      }


      if (
        selectedStatus ===
        "monitoring"
      ) {

        report =
          JordanState.setMonitoring(
            selectedAction,
            note
          );

      }


      window.location.href =
        "foreman.html";

    }
  );

}


/* =========================================
   BACK TO DASHBOARD
   ========================================= */

if (backToDashboardButton) {

  backToDashboardButton.addEventListener(
    "click",
    () => {

      window.location.href =
        "foreman.html";

    }
  );

}