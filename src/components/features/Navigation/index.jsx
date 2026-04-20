// Libraries
import { memo } from "react";
import { NavLink } from "react-router-dom";

// Components
import BrandIcon from "./icons/brand-icon";

// Utils
import classnames from "utils/classnames";

// Constants
import { NAV_ITEMS } from "./constants";

function Navigation() {
  return (
    <aside className="navigation">
      <div className="navigation__inner">
        <div className="navigation__brand d-flex align-items-center justify-content-start px-3">
          <div className="navigation__brand-logo d-flex align-items-center justify-content-center">
            <BrandIcon />
          </div>

          <div className="navigation__brand-content d-flex flex-column">
            <h1 className="navigation__brand-title mb-0">INVERSIONES AJD</h1>
            <span className="navigation__brand-subtitle">ENTERPRISE OPS</span>
          </div>
        </div>

        <nav
          aria-label="Main navigation"
          className="navigation__menu d-flex flex-column"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              end
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                classnames([
                  isActive ? "active" : "",
                  "navigation__link d-flex align-items-center justify-content-start text-decoration-none",
                ])
              }
            >
              <span className="navigation__icon d-flex align-items-center justify-content-center">
                {item.icon}
              </span>

              <span className="navigation__label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}

export default memo(Navigation);
