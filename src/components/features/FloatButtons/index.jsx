// Librarys
import PropTypes from "prop-types";
import { isValidElement } from "react";

// Components
import Button from "components/common/Button";
import ChevronLeftIcon from "components/icons/chevron-left-icon";
import ChevronRightIcon from "components/icons/chevron-right-icon";

// Utils
import classnames from "utils/classnames";

export default function FloatButtons({
  onBack,
  onNext,

  disabledBackButton,
  disabledNextButton,

  renderExtraButton,
  nextButtonTitlePopup,
  nextButtonTitle = "Continue",
  nextButtonIcon = <ChevronRightIcon />,

  isFetching,
  isShowingBackButton = true,
}) {
  return (
    <>
      <div className="dummy-box" />

      <div className="training-float-buttons w-100 position-fixed end-0 bg-white d-flex align-items-center justify-content-between">
        {isValidElement(renderExtraButton) && renderExtraButton}

        <div className="box w-100 end-0 bottom-0 bg-white d-flex align-items-center justify-content-end">
          {isShowingBackButton && (
            <Button
              onClick={onBack}
              disabled={disabledBackButton}
              icon={<ChevronLeftIcon />}
              titlePopup="Click to back to the previous stage"
              className="btn-back"
            />
          )}

          <Button
            type="submit"
            onClick={onNext}
            icon={nextButtonIcon}
            title={nextButtonTitle}
            isLoading={isFetching}
            disabled={disabledNextButton}
            titlePopup={nextButtonTitlePopup}
            className={classnames([
              isFetching ? "submitting" : "",
              "btn-next btn-submit fw-medium flex-row-reverse",
            ])}
          />
        </div>
      </div>
    </>
  );
}

FloatButtons.propTypes = {
  onBack: PropTypes.func,
  onNext: PropTypes.func,

  disabledBackButton: PropTypes.bool,
  disabledNextButton: PropTypes.bool,

  nextButtonIcon: PropTypes.node,
  nextButtonTitle: PropTypes.string,
  nextButtonTitlePopup: PropTypes.string,
  renderExtraButton: PropTypes.node,
};
