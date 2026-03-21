import type React from "react";
import { useTranslation } from "react-i18next";

const DynamicX402FacilitatorCard: React.FC = () => {
  const { t } = useTranslation("address");

  return (
    <div className="facilitator-info-card dynamic-facilitator-card">
      <div className="account-card-title">{t("facilitatorInfo")}</div>

      <div className="account-card-row">
        <span className="facilitator-name-display">
          <img src="/openscan-logo.png" alt="Detected Facilitator" className="facilitator-logo" />
          {t("detectedFacilitator")}
        </span>
      </div>

      <div className="account-card-row">
        <span className="account-card-value">{t("detectedFacilitatorDescription")}</span>
      </div>

      <div className="account-card-row">
        <span className="facilitator-capability-badge supported">
          {t("activeBehaviorDetected")}
        </span>
      </div>
    </div>
  );
};

export default DynamicX402FacilitatorCard;
