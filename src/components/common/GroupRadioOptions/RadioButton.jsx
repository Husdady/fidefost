// Librarys
import { memo } from "react";
import PropTypes from "prop-types";

// Utils
import classnames from "utils/classnames";

function RadioButton({ name, option, checked, onChange }) {
  // Get option id
  const optionId = `${name}-${option?.value}`;

  return (
    <li
      style={option?.customContainer?.style}
      className={classnames([
        option?.customContainer?.className,
        option?.disabled ? "disabled" : null,
        "radio-button position-relative d-flex align-items-center",
      ])}
    >
      <input
        type="radio"
        name={name}
        id={optionId}
        checked={checked}
        onChange={onChange}
        value={option?.value}
        disabled={option?.disabled}
        className="hidden radio-input"
      />

      <label
        htmlFor={optionId}
        style={option?.style}
        className={option?.className}
      >
        {option?.label}
      </label>
    </li>
  );
}

RadioButton.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  name: PropTypes.string.isRequired,
  option: PropTypes.object.isRequired,
};

export default memo(RadioButton, (prevProps, nextProps) => {
  return (
    prevProps.option === nextProps.option &&
    prevProps.checked === nextProps.checked &&
    prevProps.onChange === nextProps.onChange
  );
});
