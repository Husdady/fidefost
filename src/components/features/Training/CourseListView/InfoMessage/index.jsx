// Librarys
import { memo } from "react";

// Components
import BlueCheckCircleIcon from "./blue-check-circle-icon";

// Constants
import perks from "./perks";

function InfoMessage() {
  return (
    <article className="onboarding-info-message d-flex flex-column row-gap-2 p-3">
      <p className="message mb-2">
        Trainings are the foundation of your growth.
        <br />
        Complete your PINCH training to unlock your first job.
        <br />
        Continue learning to access better opportunities and increase your
        earnings with the next trainings you’ll find in your Pro PINCH account.
      </p>

      <ul className="perks list-unstyled mb-0 d-flex flex-wrap">
        {perks.map((perk, i) => (
          <li
            key={`courses-stage-perk-item-${i}`}
            className="perk-item d-flex align-items-center"
          >
            <BlueCheckCircleIcon />
            <span className="perk">{perk}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default memo(InfoMessage);
