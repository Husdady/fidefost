// Librarys
import PropTypes from "prop-types";
import { memo, isValidElement } from "react";

// Hooks
import useInputText from "./useInputText";

// Utils
import classnames from "utils/classnames";
import isValidString from "utils/isValidString";

function InputText({
  value,
  disabled,
  readOnly,
  autoFocus,

  containerStyle,
  containerClassName,
  customInput = {},

  error,
  style,
  className,
  textLabel,
  placeholder,
  type = "text",

  onBlur,
  onFocus,
  onChange,
  onKeyDown,
  onPressEsc,
  onPressEnter,
}) {
  const { handleBlur, handleFocus, handleChange, handleKeyDown } = useInputText(
    {
      onBlur: onBlur,
      onFocus: onFocus,
      onChange: onChange,
      onKeyDown: onKeyDown,
      onPressEsc: onPressEsc,
      onPressEnter: onPressEnter,
      customInput: customInput,
    }
  );

  return (
    <div
      style={containerStyle}
      className={classnames([containerClassName, "form-control-container"])}
    >
      {(isValidString(textLabel) || isValidElement(textLabel)) && (
        <h6 className="input-label mb-1">{textLabel}</h6>
      )}

      <input
        {...customInput}
        ref={customInput?.ref}
        type={type}
        style={style}
        value={value}
        onBlur={handleBlur}
        readOnly={readOnly}
        disabled={disabled}
        autoFocus={autoFocus}
        onFocus={handleFocus}
        onChange={handleChange}
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        autoComplete="new-password"
        onClick={(e) => e.stopPropagation()}
        className={classnames([
          className,
          "form-control px-2",
          readOnly ? "read-only" : null,
          isValidString(error) ? "input-has-error" : null,
        ])}
      />
    </div>
  );
}

InputText.propTypes = {
  style: PropTypes.object,
  customInput: PropTypes.object,

  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  autoFocus: PropTypes.bool,

  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,

  type: PropTypes.string,
  error: PropTypes.string,
  value: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  containerClassName: PropTypes.string,
  textLabel: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
};

export default memo(InputText, (prevProps, nextProps) => {
  return (
    prevProps.value === nextProps.value &&
    prevProps.error === nextProps.error &&
    prevProps.style === nextProps.style &&
    prevProps.onBlur === nextProps.onBlur &&
    prevProps.onFocus === nextProps.onFocus &&
    prevProps.onChange === nextProps.onChange &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.readOnly === nextProps.readOnly &&
    prevProps.textLabel === nextProps.textLabel &&
    prevProps.className === nextProps.className &&
    prevProps.onKeyDown === nextProps.onKeyDown &&
    prevProps.onPressEsc === nextProps.onPressEsc &&
    prevProps.customInput === nextProps.customInput &&
    prevProps.placeholder === nextProps.placeholder &&
    prevProps.onPressEnter === nextProps.onPressEnter
  );
});
