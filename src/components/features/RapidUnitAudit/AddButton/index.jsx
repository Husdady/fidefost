// Components
import Button from "components/common/Button";
import CirclePlusIcon from "./circle-plus-icon";

// Utils
import classnames from "utils/classnames";

export default function AddButton(props) {
  return (
    <Button
      {...props}
      icon={<CirclePlusIcon />}
      className={classnames(["add-button fw-semibold", props.className])}
    />
  );
}
