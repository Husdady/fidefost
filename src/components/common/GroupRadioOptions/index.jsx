// Librarys
import PropTypes from "prop-types";

// Components
import RadioButton from "./RadioButton";

// Hooks
import useGroupRadioOptions from "./useGroupRadioOptions";

// Utils
import classnames from "utils/classnames";

const HORIZONTAL = "horizontal";

export default function GroupRadioOptions({
  onChange,
  className,
  selectedOption,
  options = [],
  align = HORIZONTAL,
  name = "radio-item",
}) {
  const { handleOnChange } = useGroupRadioOptions({
    options: options,
    onChange: onChange,
  });

  return (
    <ul
      className={classnames([
        className,
        "p-0 list-unstyled group-radio-options d-flex",
        align === HORIZONTAL ? "flex-row flex-wrap" : "flex-column",
      ])}
    >
      {options.map((option, i) => {
        return (
          <RadioButton
            name={name}
            option={option}
            key={`${name}-${option.value}`}
            checked={selectedOption === option.value}
            onChange={(e) => {
              handleOnChange({ event: e, option: option, index: i });
            }}
          />
        );
      })}
    </ul>
  );
}

GroupRadioOptions.propTypes = {
  onChange: PropTypes.func,

  name: PropTypes.string,
  align: PropTypes.string,
  className: PropTypes.string,
  selectedOption: PropTypes.string,

  options: PropTypes.arrayOf(PropTypes.object).isRequired,
};
